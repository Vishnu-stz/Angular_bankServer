// import express
const express = require('express')


//import cors
const cors = require('cors')


// import Logic File 
const logic = require('./service/logic')


//
const jwt = require('jsonwebtoken')


// Server Creation
const BankServer = express()


// incoming json type data convert to js
BankServer.use(express.json())


// Connect Front-End
BankServer.use(cors({orgin : 'http://localhost:4200'}))



// set Port
BankServer.listen(3000 , () => {
    console.log("Server Started @3000 .... :) ");
})



// MiddleWares Section
const tokenMiddleware = (req , res , next) => {

    try {
        const token = req.headers['access_token']
        jwt.verify(token , 'bankKey@98')
        next()
    }
    catch {
        res.status(404).json({
            message     :   "Token Not Verified" ,
            status      :   false ,
            statusCode  :   404
        })
    }

}



//   register           -       Post
BankServer.post('/register' , (req , res) => {
    logic.register(req.body.acno , req.body.psw , req.body.uname).then(result => {
        // converts js to json and send as response 
        res.status(result.statusCode).json(result)
    })
})


// login                -       post
BankServer.post('/login' , (req , res) => {
    logic.login(req.body.acno , req.body.psw).then(result => {
        res.status(result.statusCode).json(result)
    })
})


// get user data        -       get
BankServer.get('/getuser/:acno' , tokenMiddleware , (req , res) => {
    logic.getUser(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})



// balance              -       get
BankServer.get('/balance/:acno' , tokenMiddleware , (req , res) => {
    logic.getBalance(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})



// Transfer             -       post
BankServer.post('/transfer' , tokenMiddleware , (req , res) => {
    logic.moneyTransfer(
        req.body.FromAcno , 
        req.body.ToAcno , 
        req.body.Amount , 
        req.body.Psw ,
        req.body.Date).then(result => {
            res.status(result.statusCode).json(result)
         })
})



// transaction history  -   post
BankServer.get('/history/:acno' , tokenMiddleware , (req , res) => {
    logic.getTransaction(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})




// account              -    delete
BankServer.delete('/deleteAc/:acno' , tokenMiddleware , (req ,  res) => {
    logic.deleteAcc(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})










// Server api resolve
// ---------------------

// BankServer.post('/PostExample' , (req , res) => {
//     res.send("...........Post Request")
// })

// BankServer.get('/GetExample' , (req , res) => {
//     res.send("Get Request Success")
// })