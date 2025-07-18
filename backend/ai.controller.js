const aiService = require('./services/ai.service')
const {runAggregation} = require('./services/log.service')

async function answerQuestion(req, res) {
  try {
    const question = req.query.question
    if (!question) return res.status(400).json({ error: 'Missing question parameter' })

    const aiResponse = await getPipelineFromQuestion(question)

    if (aiResponse.message !== "") {
        res.json({ message: aiResponse.message })
        return
    }

    validateAiResponse(aiResponse)

    const result = await runAggregation(aiResponse.pipeline)

    console.log("aiResponse.pipeline", JSON.stringify(aiResponse.pipeline))
    console.log("result", result)

    if (result.length === 1){
        const explanation = await aiService.humanLikeExplanation(question, result[0])
        return res.json({ message: explanation })
    }

    if (result.length === 0){
        return res.json({message:'I wasn`t able to find any results, you`re welcome to try different question'})
    }

    // TODO: Use AI to generate explanation next to the table/chart
    res.json({ message: "", result })

  } catch (err) {
    console.error('Failed to answer question:', err)
    res.status(500).json({ error: 'Failed to process question', detail: err.message })
  }
}

async function getPipelineFromQuestion(question) {
  return await aiService.askGemini(question)
}

function validateAiResponse(aiResponse) {
  if (!aiResponse.pipeline || !Array.isArray(aiResponse.pipeline)) {
    throw new Error('Invalid AI response: pipeline is missing or not an array')
  }
}


module.exports = {
  answerQuestion
}