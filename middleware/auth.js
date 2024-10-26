import jwt from "jsonwebtoken";

const auth = async(req,res,next)=>{
   try{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message : "user is not authorized" , status : false});
    }
    const payload = await jwt.verify(token ,process.env.JWTSECRET);
    if(!payload){
        return res.status(401).json({message : "invalid token" , status : false});
    }
    req.id = payload.userId;
    next();
   }
   catch(err){
     return res.status(500).json({error : err.message});
   }
}

export default auth;