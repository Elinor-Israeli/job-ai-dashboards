const { GoogleGenAI } = require('@google/genai')
require('dotenv').config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MODEL_NAME = 'gemini-2.0-flash'
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const companyMissionPrompt = `
Explanation about the collection: Every day in my company, we receive approximately 20 million new job postings that
must be indexed. Each hour, indexing processes run for each client, and logs are generated for each indexing event.
This data represents these indexing logs. 

The schema of 'jobskill-logs' is the following:

{
    "_id": ObjectId, 
    "transactionSourceName" : String, // the name of the client which we process its job postings 
    "timestamp": Date, // The date when the indexing event happened
    "status": String,  // The status of the indexing operation (only the events have "completed" status right now)
    "country_code": String, // the code of the country for example: US
    "currency_code": String,
    "progress": {
      "SWITCH_INDEX": boolean, //True if indexing switched to a new ElasticSearch index. 
      "TOTAL_RECORDS_IN_FEED": Int32, //Items received before filtering. 
      "TOTAL_JOBS_FAIL_INDEXED": Int32, // Failed indexing count.
      "TOTAL_JOBS_IN_FEED": Int32, //Items after filtering (min CPC, etc.). 
      "TOTAL_JOBS_SENT_TO_ENRICH": Int32, //Jobs sent to LLM for metadata enrichment. 
      "TOTAL_JOBS_DONT_HAVE_METADATA": Int32, //Jobs lacking metadata after enrichment.
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": Int32, //This field is a more updated version of TOTAL_JOBS_DONT_HAVE_METADATA. Please use it in query unless the user was very intentional about using TOTAL_JOBS_DONT_HAVE_METADATA instead.
      "TOTAL_JOBS_SENT_TO_INDEX": Int32 // Successfully indexed jobs.
    },
}
`

// As I don't have documentation and not sure about the meaning and relevance of the following fields: recordCount, uniqueRefNumberCount and noCoordinatesCount
const getPipelinePrompt = `
You are a data assistant that helps translate user questions into MongoDB aggregation pipeline queries.
You have a MongoDB collection called 'jobskill-logs'.

` + companyMissionPrompt + `

Only respond in this JSON format:
{
  "pipeline":array of objects ,    // The query
  "message": string         // A message to the the user
}


If you are able to return a query, leave the "message" field empty

If the user's question is unclear, or the answer for the question is not in the schema I've provided you
please return to the user an indicative message in the "message" field.

To be clear: the aggregation pipeline should only reference fields that were mentioned in the schema above.
Don't make up new fields.
`

/**
When you need to match timestamp against current date or another date relative to current date, only use Date.now() , don't do it in any other way.
For example: """
      $match: {
        timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        status: 'completed'
      }


for example : the user writes : "Average TOTAL_JOBS_SENT_TO_INDEX per client last month?" 
you need to return : 
{
  "pipeline":[
    {
      $match: {
        timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$transactionSourceName',
        avg_jobs_indexed: { $avg: '$progress.TOTAL_JOBS_SENT_TO_INDEX' }
      }
    }
  ] , 
   "message" : ""
}
*/
async function getPipelineFromQuestion(userQuestion) {
  const fullPrompt = `${getPipelinePrompt}\n\nUser Question: ${userQuestion}`

  const result = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: fullPrompt,
  })

  const response = result.text

  // Try to extract JSON safely
  const jsonText = response.match(/\{[\s\S]*\}/)?.[0]
  return JSON.parse(jsonText)
}

async function humanLikeExplanation(question, oneResult){
  const prompt = `The user asked the following question: "${question}".
  We got back from the database the following result that should answer the user's question: "${JSON.stringify(oneResult, null, 2)}".
  Your job is to use the given question and result and write a human answer to the question.
  Explain the result in a clear , helpful way.
  For example: the user asked something like "Count how many documents have SWITCH_INDEX set to True",
  the result looks something like this: "[ { total_documents: 89242 } ]".
  You can answer back in this way : "A total of 89,242 documents in the database have progress.SWITCH_INDEX set to true." or like
  "There are 89,242 documents where SWITCH_INDEX is set to true."
  `

  const result = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  })

  return result.text
}

async function decideOnDataPresentation(question, results) {
  const numResults = results.length

  // We assume that returned objects are not nested..
  const keys = Object.keys(results[0])
  const types = keys.map(key => typeof results[0][key])

  const schema = Array.from({ length: keys.length }, (_, i) => [keys[i], types[i]])

  const getDataPresentationStrategyPrompt = `
  You are an expert data analyst who is proficient with answering question with data and visualize data when needed.
  In this task you will get a question a user asked and information about results from a query that was made for answering the question.
  You will need to decide how to present the data. The options are table, bar chart and line chart.
  Only choose bar chart or line chart if it make sense to present the data like this. If not, just return the table option.
  In addition to returning the presentation mode you will return the following:
  1. For charts only - the field name which will the x axis ( For table return empty string)
  2. The fields which will be visualized (either in table or in chart. In line chart each field is a different line and in bar chart each field is a different series of bars)
      Also the order of the fields might matter for the table to be clear so pay attention to this and you are tasked with giving a display name for the field
  3. Short explanation about the visualization presented to the user

  You will return the result in Json format. An example of the expected format:
  {
    "mode": "line" (Allowed modes are "table","bar","line")
    "x_axis": "timestamp"
    "fields": [
      {
        "name": "currency_rate",
        "display_name": "Currency Rate"
      },
      {
        "name": "stock_price",
        "display_name": "Stock Price"
      }
    ],
    "message": "This line chart presents changes in Currency Rate and Stock Price over time"
  }

  All the questions and results are related to my company collection in called 'jobskill-logs'.

` + companyMissionPrompt + `

  The input to your task is the following: 
  1. The user question was "${question}"
  2. The format of the rows returned from the query was "${schema}"
  3. The number of rows returned from the query was "${numResults}"
  `

  const result = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: getDataPresentationStrategyPrompt,
  })

  const response = result.text

  // extract JSON safely
  const jsonText = response.match(/\{[\s\S]*\}/)

  return JSON.parse(jsonText)
}

module.exports = { getPipelineFromQuestion , humanLikeExplanation, decideOnDataPresentation}
