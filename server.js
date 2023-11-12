const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const passwordChecked = 'testPas'
const Secret = 'dshasyudhosady7uqadhuiasddu89adu9q8i9d12'
var jsonToken = ''
    //Подключить монгу 
app.listen('3000', () => {
    console.log('server started')
})

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'static')))

app.use('/checkPas', async(req, res) => {
    const { password } = req.body

    try {
        if (password === passwordChecked) {
            jsonToken = jwt.sign({ 'name': 'admin' },
                Secret, { expiresIn: '1h' }
            )
            return res.send({ 'status': 'ok', 'token': jsonToken })
        } else
            return res.send({ 'status': 'error' })
    } catch ({ name, message }) {
        console.log(name)
    }
})

app.use('/checkToken', async(req, rs) => {
    const { token: fromClientToken } = req.body
    jwt.verify(fromClientToken, Secret, (error) => {
        if (error)
            return rs.send({ 'status': 'error' })
        else
            return rs.send({ 'status': 'ok' })
    })
})