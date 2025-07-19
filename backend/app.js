const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const logRoutes = require('./routes/log.router')
const aiRoutes = require('./routes/ai.router')

dotenv.config()


const app = express()
const server = require('http').createServer(app)

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.use('/api/logs', logRoutes)
app.use('/api/ai', aiRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err))

app.get('/', (req, res) => res.send('API is running'))

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})