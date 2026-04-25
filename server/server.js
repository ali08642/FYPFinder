const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')

const connectdb = require('./config/db')

dotenv.config()

connectdb()

const app = express()

// Middleware
app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())


//auth routues
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))