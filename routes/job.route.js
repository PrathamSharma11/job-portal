import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {postJob, getAllJobs,getRecruiterJobs,getJobById} from "../controllers/job.controller.js";



const router = express.Router();


router.route("/post").post(isAuthenticated,postJob);
router.route("/getJobs").get(isAuthenticated,getAllJobs);
router.route("/getrecruiterjobs").get(isAuthenticated,getRecruiterJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);




export default router;