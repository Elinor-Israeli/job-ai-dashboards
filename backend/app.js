const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const logRoutes = require('./log.router')

const dotenv = require('dotenv')


dotenv.config()

const app = express()
const server = require('http').createServer(app)

const corsOptions = {
  origin: ['http://localhost:5173',
           'http://localhost:5174'
          ],
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/logs', logRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err))

app.use('/api/logs', logRoutes)

app.get('/', (req, res) => res.send('API is running'))

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
