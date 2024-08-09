const mongoose = require("mongoose")
const env = require("dotenv").config()
const connet_to_db = async()=>{
    try {
            await mongoose.connect(process.env.MONGO_URL)
            console.log("connected to db")
    } catch (error) {
        console.log("Failed to connect to db",error)
    }
    }


module.exports = connet_to_db