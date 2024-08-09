const mongoose = require("mongoose")

const blacklistschema = new mongoose.Schema({
    token: {type:String, required:true, unique:true},
})

const Blacklist = mongoose.model("blacklist", blacklistschema)

module.exports = Blacklist