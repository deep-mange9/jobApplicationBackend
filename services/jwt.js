import jwt from "jsonwebtoken";

const createToken = (userdata)=>{
   return jwt.sign(userdata , process.env.JWTSECRET , {expiresIn : '1d'});
}

export default createToken;