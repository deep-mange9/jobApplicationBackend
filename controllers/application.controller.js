import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

// apply job(any user(student) can apply to any job)

const applyJob = async (req,res)=>{
    try{
      const jobId = req.params.id;
      const userId = req.id;

    // to create the job jobID is compulsory
      if(!jobId){
        return res.status(400).json({message : "job id is required" , success : false});
      }

    // check whether the job exist or not which the user is applying
    const job = await Job.findById(jobId);
    if(!job){
     return res.status(404).json({
         message : "job doesnt exist",
         success : false,
     })
    }

    // check what if user has already applied for this job or not   
      const application = await Application.findOne({job : jobId , applicant : userId});
        if(application){
        return res.status(400).json({
            message : "user has already applied for this job",
            success : false,
        })
      }
    
    

    // create application
        const newApplication = await Application.create
        (
            {
                job : jobId,
                applicant : userId,  
            }
        );

        // add application to particular job
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message : "job applied successfully",
            success : true,
        })
    }
    catch(err){
        return res.status(500).json({error : "internal server error" , message : err.message});
    }
}


// user -> to see to which job they have applied

const getAppliedJobs = async (req,res)=>{
    try{
       const userId = req.id;
       const application = await Application.find({applicant : userId}).sort({createdAt : -1}).populate({
         path : "job",
         options : {sort : {createdAt : -1}},
         populate : {
            path : "company",
            options : {sort : {createdAt : -1}},
         }
       });

       if(!application){
         return res.status(404).json({message : "user has applied to no jobs" , success : false});
       }
    
       return res.status(200).json({
         message : "successfully found",
         application,
         success : true,
       })
       
    }
    catch(err){
        return res.status(500).json({error : "internal server error" , message : err.message});
    }
}

// admin that has created job can see how many people have applied to that job

const getApplicants = async(req,res)=>{
   try{
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
        path : 'applications',
        options : {sort : {createdAt : -1}},
        populate : {path : 'applicant'},
      });

      if(!job){
        return res.status(404).json({
            message : "no job found",
            success : false,
        })
      }

      return res.status(200).json({
        message : "applicants successfully founded",
        success : true,
        job,
      })
   }
   catch(err){
      return res.status(500).json({error : "internal server error" , message : err.message});
   } 
}

// update status means admin cand accept or reject the status

const updateStatus = async(req,res)=>{
    try{
       const {status} = req.body;
       const applicationId = req.params.id;
       if(!applicationId){
        return res.status(400).json({
            message : "application ID is required",
            success : false,
        })
       };
       if(!status){
         return res.status(400).json({
            message : "status is required",
            success : false,
         })
       };

       const application = await Application.findById(applicationId);

       if(!application){
        return res.status(404).json({
            message : "application not found",
            success : false,
         })
       }

       application.status = status.toLowerCase();

       await application.save();

       return res.status(200).json({
        message : "status updated successfully",
        success : true,
       })      
    }
    catch(err){
      return res.status(500).json({error : "internal server error" , message : err.message}); 
    }
}










export {applyJob , getAppliedJobs ,getApplicants ,updateStatus};