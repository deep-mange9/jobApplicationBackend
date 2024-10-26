import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createToken from "../services/jwt.js";

const register = async(req,res)=>{
    try{
       const {fullName ,email,phoneNumber,password,role} = req.body;
       if(!fullName || !email || !phoneNumber , !password , !role){
         return res.status(400).json({message : "something is missing" , success : false});
       }
       const user = await User.findOne({email : email});
       if(user){
        return res.status(400).json({message : "user with given email id already exist" , success : false});
       }

       const hashedPassword = await bcrypt.hash(password , 10);
       await User.create({
        fullName ,
        email,
        phoneNumber,
        password : hashedPassword,
        role,
       });
       return res.status(201).json({
         message : "accounted successfully created",
         success : true,
       })
    }
    catch(error){
       return res.status(500).json({error : "internal server error" , message : error.message});
    }
}

const login = async(req,res)=>{
    try{

       const {email , password ,role} = req.body;
       if(!email || !password || !role){
         return res.status(400).json({message : "something is missing" , success : false});
       }

       let user = await User.findOne({email : email});
       if(!user){
        return res.status(400).json({message : "user with given email id doesnt exist" , success : false});
       }

       // check role is correct or not
       if(role !== user.role){
        return res.status(400).json({message : "please provide correct role" , success : false});
       }

       // verify user password
        const result = await bcrypt.compare(password ,user.password);
        if(!result){
            return res.status(400).json({message : "password is incorrect" , success : false});
        }

        const payload={
            userId : user._id,
        }  
        const jwtToken = createToken(payload);
         user = {
           _id : user._id, 
           fullName : user.fullName,
           email : user.email,
           phoneNumber : user.phoneNumber,
           role : user.role,
           profile : user.profile,
        }

        return res.status(200).cookie("token" , jwtToken , {maxAge : 1*24*60*60*1000 ,httpsOnly : true , sameSite : 'strict'}).json(
            {
                message : `welcome back ${user.fullName}`,
                user,
                success : true,
            }
        )      
    }
    catch(error){
       return res.status(500).json({error : "internal server error" , message : error.message}); 
    }
}

const logout = async(req,res)=>{
    try{
      return res.status(200).cookie("token" , "" , {maxAge : "0"}).json({
        message : "logged out successfully",
        success : true,
      })  
    }
    catch(error){
        return res.status(500).json({error : "internal server error" , message : error.message}); 
    }
}

const updateProfile = async (req,res)=>{
    try{
      const {fullName , email , phoneNumber , bio , skills} = req.body;
      const file = req.file;

      let skillsArray;
      if(skills){
        skillsArray = skills.split(",");
      }
      const userId = req.id;
      let user = await User.findById(userId);

      if(!user){
        return res.status(400).json({message : "user doesnt found" , success : false});
      }

      if(fullName) user.fullName = fullName;
      if(email) user.email = email;
      if(phoneNumber) user.phoneNumber = phoneNumber;
      if(bio) user.profile.bio = bio; 
      if(skills) user.profile.skills = skillsArray;
    

      await user.save();

      user = {
        _id : user._id, 
        fullName : user.fullName,
        email : user.email,
        phoneNumber : user.phoneNumber,
        role : user.role,
        profile : user.profile,
     }

     return res.status(200).json({message : "profile update successfully" , success : true , user});
    }
    catch(error){
        return res.status(500).json({error : "internal server error" , message : error.message});
    }
}











export {register , login , logout , updateProfile};