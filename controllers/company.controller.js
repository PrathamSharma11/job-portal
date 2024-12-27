import {Company} from '../models/company.model.js';
export const registercompany = async(req,res)=>{
    // console.log(req.body);
    const {companyName} = req.body;
    // console.log(companyName);
    if(!companyName){
        return res.status(400).json({
            message:"company name is required",
            success:"false"

        })
    }
    let company = await Company.findOne({name:companyName})
    // console.log(company);
    if(company){
        return res.status(400).json({
            message:"company name is exist choose another name",
            success:"false"

        })
    }
    company = await Company.create({
        name:companyName,
        userId:req.id //from cookie

    });
    return res.status(201).json({
        message:"company created",
        company,
        success:"true "

    })
}


export const getCompany = async(req,res)=>{
       try {
        const userId = req.id    //loggedinUser
        const company = await Company.find({userId});
        if(!company){
            return res.status(400).json({
                message:"no company found",
                success:"false"
        
            })
        }
        else{
            return res.status(200).json({
                message:"company found",
                company,
                success:"true"
        
            })
        }
       } catch (error) {
        console.log(error)
       }
}


export const getCompanyById = async(req,res)=>{
    try {
        const companyId = req.params.id 
        //console.log(companyId);    
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(400).json({
                message:"no company found",
                success:"false"
        
            })
        }
        else{
            return res.status(200).json({
                message:"company found",
                company,
                success:"true"
        
            })
        }
       } catch (error) {
        console.log(error)
       }
}



export const updateCompany = async(req,res)=>{
    try {
        const {name,description,website,location} = req.body;
        const file = req.file;

        const updateData = {name,description,website,location};
        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});
        
        if(!company){
            return res.status(400).json({
                message:"no company found",
                success:"false"
        
            })
        }
        return res.status(200).json({
            message:"company information updated",
            success:"true"
    
        })
        
        
    } catch (error) {
        console.log(error)
    }
}