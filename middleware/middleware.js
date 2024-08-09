const jwt = require("jsonwebtoken")
const Blacklist = require("../model/blacklist.schema")




const auth_token = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const blacktoken = await Blacklist.findOne({token:token})
    if(blacktoken){
       return res.send({msg:"token not valid"})
    }
    if(token){
        try {
            const decoded = jwt.verify(token,process.env.key)
            if (decoded) {
                req.userdetails = decoded.id
                next()
            }
            else{
                res.send({msg:"token not valid"})
            }
            
        } catch (error) {
            res.send({msg:"authentication error",error})
        }
    }
    else{
        res.send({msg:"Please login first"})
    }
}

    
    


module.exports = auth_token