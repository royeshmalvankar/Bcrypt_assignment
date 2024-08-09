const express = require("express")
const userRoutes = require("./route/user.route")
const connet_to_db = require("./config/db")


const app = express()
const ltserver = 3001

app.use(express.json())
app.use("/user",userRoutes)

app.listen(ltserver,async()=>{
    try { 
        await connet_to_db()
        console.log("The server has started 3001")
    } catch (error) {
        console.log("The server has not started",error)
    }
})

