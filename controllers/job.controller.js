import { Job } from "../models/job.model.js";
export const postJob = async(req,res)=>{
       try {
        const {title,description,requirements,salary,location,jobType,experience,position,companyId} = req.body;
        const userId = req.id;
        if(!title || !description || !requirements || !salary ||!location ||!jobType ||!experience ||!position ||!companyId){
             return res.status(400).json({
              message:"all fields are required",
              status:false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId
        })
        return res.status(201).json({
            message:"job posted successfully",
            job,
            status:true
        })
           
       } catch (error) {
          console.log(error)
       }
}

export const getAllJobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword || "";     //params h 
        const query = {
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path:"company",

        }).sort({created_At:-1});
        if(!jobs){
            return res.status(404).json({
                message:"jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
        
    } catch (error) {
        console.log(error)
    }
}


export const getJobById = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false
            })
        }
        return res.status(200).json({
            
            success:true,
            job 
        })
    } catch (error) {
        console.log(error);
    }
}





//recruiter ne kitni jobs post ki??
export const getRecruiterJobs = async(req,res)=>{
        try {
            const recruiterId = req.id;
            const data = await Job.find({created_by:recruiterId})
            if(!data){
                return res.status(404).json({
                    message:"jobs not found",
                    success:false
                })
            };
            return res.status(200).json({
                  status:true,
                  data
            })
            
        } catch (error) {
            console.log(error)
        }
}