const mongoose = require('mongoose')
const { runAggregation } = require('../services/log.service') 
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err))

async function testAggregation() {
  const input = [
        {
            "$match": {
                "progress.SWITCH_INDEX": true
            }
        },
        {
            "$count": "total_documents"
        }
    ]
    

  try {
    const result = await runAggregation(input)
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await mongoose.disconnect()
  }
}

testAggregation()