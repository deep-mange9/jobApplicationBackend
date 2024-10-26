import Job from "../models/job.model.js";

// create job for recruiter

const postJob = async(req,res)=>{
    try{
       const {title , description ,salary, requirements , location , position  , jobType ,companyId,experienceLevel } = req.body;
       if(!title || !description || !salary || !location || !position  || !jobType || !companyId || !experienceLevel || !requirements){
        return res.status(400).json({message : "something is missing" , success : false});
       }

       const userId = req.id;
       const job = await Job.create({
          title,
          description,
          salary : Number(salary),
          location,
          requirements : requirements.split(","),
          position,
          jobType,
          company : companyId,
          createdBy : userId,
          experienceLevel : Number(experienceLevel)
       })
       return res.status(201).json({
         message : "job successfull created",
         job,
         success : true
       })
    }
    catch(err){
        return res.status(500).json({error : "internal server error" , message : err.message});
    }
};

// get all jobs for student

const getJobs = async(req,res)=>{
  try{
    const jobs = await Job.find({}).populate({path : "company"}).sort({createdAt : -1});
    if(!jobs){
        return res.status(404).json({
            message : "NO JOBS FOUND",
            success : false,
        })
    }
    return res.status(200).json({
        message : "JOBS FOUND",
        jobs,
        success : true,
    })
  }
  catch(err){
    return res.status(500).json({error : "internal server error" , message : err.message});
  }
}

// get job by id for student

const getJobById = async(req,res) =>{
    try{
      const jobId = req.params.id;
      const job = await Job.findById(jobId);
      if(!job){
        return res.status(404).json({
            message : "NO JOB FOUND with given id",
            success : false,
        })
      }
      return res.status(200).json({
        message : "JOB FOUND",
        job,
        success : true,
      })

    }
    catch(err){
        return res.status(500).json({error : "internal server error" , message : err.message});
    }
}

// get all jobs created by a recruiter

const getAdminJob = async (req,res) =>{
    try{
       const userId = req.id;
       const jobs = await Job.find({createdBy : userId});
       if(!jobs){
        return res.status(404).json({
            message : "NO JOBS FOUND",
            success : false,
        })
       }
       return res.status(200).json({
         message : "successfully founded",
         jobs,
         success : true,
       })
    }
    catch(err){
      return res.status(500).json({error : "internal server error" , message : err.message}); 
    }
}




export {postJob , getJobs , getJobById , getAdminJob};