const mongoose = require('mongoose')

const connect = () => {
    mongoose.connect(process.env.MONGO_URI).then((data)=>{
        console.log(`MongoDB connected with server : ${data.connection.host}`)
    })
}

module.exports = connect