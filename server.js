const express = require('express')
const dotenv = require('dotenv')
const connect = require('./config/database')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookie_parser())
app.use(cors())
// app.use(body_parser)

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaughtException")
    process.exit(1)
})

dotenv.config({path:'./config/config.env'})

connect()

const product = require('./routes/productRoutes')
const user = require('./routes/userRoutes')
const order = require('./routes/orderRouters')

app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1', order)

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`)
})

process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to unhandle promise rejection")
    server.close(()=>{
        process.exit(1)
    })
})