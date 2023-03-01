const { Router } = require('express')
const modules = require('../modules/auth.modules')
const response = require('../helpers/response')

const app = Router()

app.post('/', async (req, res, next) => {
    response.sendResponse(res, await modules.login(req.body))
})

module.exports = app