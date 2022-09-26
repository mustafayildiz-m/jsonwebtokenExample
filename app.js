const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const app = express();
const host = 'localhost';
const port = 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const checkToken = (req, res, next) => {
    req.headers.authorization = req.cookies['token']

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token === undefined) {
        return res.status(400).send({ "error": "token is not present" })
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
    }
    if (token) {
        jwt.verify(token, "thisismysecret", (err, decoded) => {
            if (err) {
                return res.json(
                    {
                        success: false,
                        message: "token is not right"
                    }
                )
            } else {
                req.decoded = decoded;
                next();


            }

        })
    } else {
        return res.json({
            success: false,
            message: 'token is not right'
        })
    }

}


app.post('/login', async (req, res) => {


    let { loginData } = req.body
    let userName = "Mustafa"
    let password = "YILDIZ"
    if (userName === loginData.userName && password === loginData.password) {
        //create token
        const token = jwt.sign({ userName, role: 'admin' }, 'thisismysecret', { expiresIn: '24h' })
        res.cookie('token', token)

        return res.status(200).send({ token: token })
    } else {
        res.status(400).json({
            message: "user not found"
        })
    }


})

app.get('/mysecuredendpoint', checkToken, async (req, res) => {


    return res.status(200).send({ data: 'success' })



})

// {
//     "loginData": {
//         "userName": "Mustafa",
//         "password": "YILDIZ"
//     }
// }



app.listen(port, () => {
    console.log("listening" + ":" + port)
})