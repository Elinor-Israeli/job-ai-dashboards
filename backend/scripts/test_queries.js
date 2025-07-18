const dotenv = require('dotenv')
const MongoClient = require('mongodb').MongoClient

dotenv.config()

const client = await MongoClient.connect(process.env.MONGODB_URI)
db = client.db(config.dbName)

db['jobskill-logs'].find({}).sort({timestamp: -1}).limit(5)