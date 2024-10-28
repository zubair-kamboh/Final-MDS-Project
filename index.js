const express = require('express')
const connection = require('./config/db')
const errorHandler = require('./middlewares/errorHandlers')
const app = express()
const cors = require('cors')

// body parser middlewares
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

// cors
app.use(cors())

app.use('/', require('./routes/statsRoutes'))
app.use('/predictions', require('./routes/predictionRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/activity-logs', require('./routes/activityLogRoutes'))
app.use('/faq', require('./routes/faqRoutes'))
app.use('/feedbacks', require('./routes/feedbackRoutes'));

// error handler
app.use(errorHandler)

// db connection
connection()

const port =  8000
const server = app.listen(port, () => console.log(`Server running on ${port}`))