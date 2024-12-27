import {Application} from '../models/application.model.js';
import { Job } from '../models/job.model.js';
export const applyJob = async(req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                success:false,
                message:'jobId is required'
            })
        }
        //already applied
        const exisitngApplication = await Application.findOne({job:jobId,applicant:userId});
         if(exisitngApplication){
            return res.status(400).json({
                success:true,
                message:'you have already applied for the job'
            })
         }
         //check job exist or not
         const job = await Job.findById(jobId);
         if(!job){
            return res.status(400).json({
                success:false,
                message:"no job found"
            })
         }
         //create a new application
         const newApplication = await Application.create({
            job:jobId,
            applicant:userId
         });
         job.applications.push(newApplication._id);        ///job model k andar applications field mein push kr rhe h 
         await job.save();
         return res.status(201).json({
            success:true,
            message:"applied successfully"

         })

        
    } catch (error) {
        console.log(error);
    }
}


 //ek user ne kitni jagah applied kiya
 export const getAppliedJobs = async(req,res)=>{
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',            //path means field/column
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}}
            }
        });
        if(!application){
            return res.status(400).json({
                success:false,
                message:"no applied jobs"
    
             })
        }
        return res.status(200).json({
            success:true,
            application
        })
    } catch (error) {
        console.log(error);
    }
 }

 //ek recruiter ki jobs par kine applicant aaye
 export const getApplicants = async(req,res)=>{
    try {
        const jobId= req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
            
        });
        if(!job){
            return res.status(400).json({
                success:false,
                message:"no jobs found"
    
             })
        }
        return res.status(200).json({
            success:true,
            job
        })

    } catch (error) {
        console.log(error)
    }
 }



 //update status
 export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
          return res.status(400).json({
              success:false,
              message:"status is required"
  
           })
      }
      const application = await Application.findOne({_id:applicationId});
      if(!application){
          return res.status(400).json({
              success:false,
              message:"application not found"
  
           })
      }
      application.status = status.toLowerCase();
      await application.save();
      return res.status(200).json({
          message:'status updated successfully',
          success:true
      })
        
    } catch (error) {
        console.log(error)
    }
    


 }