const express = require("express")
const User = require("../model/user.schema")
const jwt = require("jsonwebtoken")
const userRoutes = express.Router()
const bcrypt = require("bcrypt")
const Blacklist = require("../model/blacklist.schema")
const auth_token = require("../middleware/middleware")



userRoutes.post("/register",async(req,res )=> {
    try {
        const user = new User(req.body)
        const userchk = await User.findOne({email:user.email})
        if (userchk) {
           return res.json({"message":"user already registered"})
        }
        else{
            bcrypt.hash(user.password,8,function(err,hash){
                if (err){
                    return res.json({"message":`the bcrypt error is ${err}`})
                }
                user.password = hash
                user.save()
            })
            res.status(201)
            res.json({"message":"user added successfully","data":user})
        }
          
    } catch (error) {
        res.send(`The data is not valid "${error}" or some error occured`)
    }
})

userRoutes.post("/login",async(req,res )=> {
    try {
        const {email,password} = req.body
        const user= await User.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(isMatch){
                const token = jwt.sign({id:user._id},process.env.key,{expiresIn:"1h"})
                const refresh_token1 = jwt.sign({id:user._id},process.env.key2,{expiresIn:"1d"})
                res.status(200)
                res.json({"message":"login success","access_token":token,"refresh_token":refresh_token1})
            }else{
                res.status(400)
                res.json({"message":"login failed"})
            }
        }
        else{
        res.send({"message":"user not found please register"})
        }
        } catch (error) {
        res.send(`The data is not valid "${error}" or some error occured`)
    }
})

userRoutes.get("/logout",async(req,res )=> {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const blacklist = new Blacklist({token})
        await blacklist.save()
        res.status(200)
        res.send({"message":"you are logged out"})
    } catch (error) {
        res.status(400).json({"message":error})
    }
})

userRoutes.get("/profile",auth_token,async(req,res )=> { 
    try {
        const user = await User.findById(req.userdetails)
        res.status(200)
        res.send({"message":"profile","userdetails":user})
    } catch (error) {
        res.status(400).json({"message":error})
    }
})

userRoutes.get("/refresh",async(req,res )=> {
try {
        const refresh_token2 = req.headers.authorization?.split(" ")[1]
        jwt.verify(refresh_token2,process.env.key2,(err,decoded)=>{
            if(err){
                return res.send({msg:"token not valid"})
            }
            if(decoded){
                const token = jwt.sign({id:decoded.id},process.env.key,{expiresIn:"1h"})
                res.send({access_token:token})
            }
        })
} catch (error) {
    res.status(400).send({"message":error})
}
})


module.exports = userRoutes