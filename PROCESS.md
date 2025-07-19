# Architecture and key design choices
## Frontend
First of all I implemented the frontend with Material UI components. The task seemed to focus on AI and full stack architecture so I preferred to take ready-made UI components than to invest in building them myself
### Dashboard UI
In the dashboard UI I created the following 3 items for the Account Manager to get good overview of the operations:
1. Chart to show the total counts for successful,failed and other events of job processing from the last day (I hard-coded in code to 13-7-25 which is last day of data)
This will provide the account manager with the ability to quickly spot abnormalities in amount of events or their distribution
2. Chart to show the total counts of events for each hour in the last 24 hours. In case an issue happened this will help the account manager to track when it started. This will only help for system-wide issues (more need to be defined about drilling into client-specific anomallies).
3. Table where the account manager is able to view all events and also filter them by client, country, dates to deep dive into issues or to understand better client usage patterns.
### Chat UI
I built a simple chat UI with material design (other dedicated frameworks I looked at seemed to add more noise than benefit)
I implemented the communication with REST. This means the server can only sends answers and not whenever he wanted (which could happen if I used websockets) but it seemed enough for our use cases.
The UI supports receiving responses via text, table, bar chart and line chart.
It receives data, format to present at and required metadata and does the presentation accordingly.
## Backend
The backend serves APIs with Express.js. It has 3 Apis for the dashboard
* getLogs
* getAggregatedLogCounts
* getLogCountsOverTime

And One api for the chat GET `/api/ai` that receives text and returns the following structure:
```
  {
    "results": Data results,
    "mode": Allowed modes are "table","bar","line"
    "x_axis": the field name which will the x axis
    "fields": The fields which will be visualized,
    "message": Short explanation about the visualization presented to the user
  }
```

The chat api uses 3 different Prompts. see the diagram chart for more details
![graph](https://github.com/user-attachments/assets/c1bd883d-eb1f-462c-9a13-9cfb8b19d45e)

On key design decision was to ask the LLM to give us mogodb query to use for querying the database. I also considered using architecture where I define class that describes all the different query options, ask the LLM to fill it up and then use it to build the mongodb query myself.
The Pros for the design decision I made was that it reduced enormous complexity from code that would be very hard to implement completely and would introduce potential bugs. It also was quite fast to implement.
The Cons are that some bugs are very hard to diagnose and especially to fix via better prompt.
An example where this happened to me was when I tried to use Gemini to extract query from the following question: "Average TOTAL_JOBS_SENT_TO_INDEX per client last month?"
Sometimes Gemini returned the following query that was able to query the data.
```
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
```
However randomly at other times it returned this query that failed (matching with the last 30 days was somehow messing up with the query):
```
{
  "pipeline": [
    {
      "$match": {
        "timestamp": {
          "$gte": {
            "$date": {
              "$subtract": [
                {
                  "$date": "$$NOW"
                },
                {
                  "$multiply": [
                    30,
                    24,
                    60,
                    60,
                    1000
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      "$group": {
        "_id": "$transactionSourceName",
        "avg_jobs_sent_to_index": {
          "$avg": "$progress.TOTAL_JOBS_SENT_TO_INDEX"
        }
      }
    },
    {
      "$project": {
        "_id": 0,
        "client": "$_id",
        "avg_jobs_sent_to_index": 1
      }
    }
  ],
  "message": ""
}
```
However I believe that as LLMs improve this won’t be an issue.

Another issue was about safety where the query might try to change the database. In order to avoid this I added a validation that checks that the requested aggregation stages are from a closed approved list. 

# Your AI prompts and any iterations. 
All the  AI Prompts are in https://github.com/Elinor-Israeli/job-ai-dashboards/blob/main/backend/services/ai.service.js

One interesting iteration was that at first I tried to ask Gemini for mongo queries but then it returned varying results (sometimes mongosh syntax, sometimes mongodb javascript driver).
Also I needed aggregation use cases and aggregation pipelines catches both find (in $match stage) and aggregations and I was able to get good results with it


# How you used AI tools during the task. 
I used chatgpt to research on different technologies used (especially inner workings of mongo queries)
