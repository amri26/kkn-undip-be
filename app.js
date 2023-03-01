const express = require('express')
const cors = require('cors')
const response = require('./helpers/response')
const routes = require('./routes')
const app = express()

require('dotenv').config()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

routes(app)

app.use(response.errorHandler)

app.listen(port, () => {
    console.log(`Server connected to port http://localhost:${port}/`)
})