import Company from "../models/company.model.js"
import User from "../models/user.model.js"

const checkRecruiter = async(userId) =>{
   try{
     const user = await User.findById(userId);
     if(user.role === "recruiter"){
        return true; 
     }
     return false;
   }
   catch(err){
     return false;
   } 
}


const registerCompany = async(req,res)=>{
   try{
    const companyData = req.body;
    if(!companyData.name){
        return res.status(400).json({
            message : "company name is required" ,
            success : false
        }); 
    }

    // check company with same name previously exist or not ?

    let company = await Company.findOne({name : companyData.name});
    if(company){
        return res.status(400).json({message : "company with same name previously exist" , success : false});
    }

     const id = req.id;
     if(!checkRecruiter(id)){
        return res.status(400).json({message : "only recruiter can add company" , success : false});
     }

     companyData.userId = id;
     company = await Company.create(companyData);

     return res.status(201).json({
        message : "Company created successfully",
        company, 
        success : true
     })
   }
   catch(err){
     return res.status(500).json({error : "internal server error" , message : err.message});
   }
}


const getCompany = async (req,res)=>{
    try{
      const id = req.id;
      const companies = await Company.find({userId : id});
      if(!companies){
        return res.status(404).json({
            message : "Companies not Found",
            success : false,
        })
      }
      return res.status(200).json({
        message : "succesfully founded",
        companies,
        success : true,
      })  
    }
    catch(error){
      return res.status(500).json({error : "internal server error" , message : err.message});  
    }
}

const getCompanyById = async(req,res) =>{
    try{
      const companyID = req.params.id;
      const company = await Company.findById(companyID);
      if(!company){
        return res.status(404).json({message : "company not found" , success : false});
      }
      return res.status(200).json({
        message : "company found",
        company, 
        success : true
    });  
    }
    catch(error){
      return res.status(500).json({error : "internal server error" , message : err.message});  
    }
}

const updateCompany = async(req,res)=>{
    try{
      const {name , description , website ,location} = req.body;
      const file = req.file;

      const companyId = req.params.id;

      const updatedData = {name , description , website ,location};

      const company = await Company.findByIdAndUpdate(companyId , updatedData , {new : true});

      if(!company){
         return res.status(404).json({message : "company not found" , success : false});
      }

      return res.status(200).json({
        message : "company information succesfully updated",
        company,
        success : true,
      })
    }
    catch(err){
        return res.status(500).json({error : "internal server error" , message : err.message});    
    }
}








export {registerCompany , getCompany , getCompanyById , updateCompany};