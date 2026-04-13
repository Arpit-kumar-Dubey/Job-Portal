import express from 'express'
const app=express();
import dotenv from 'dotenv';
dotenv.config();
import helmet from "helmet";
import mongoose from "mongoose";
import session from "express-session";
import connectDB from "./config/db.js";
app.use(session({
  secret: 'my_super_secret_development_key',
  resave: false,
  saveUninitialized: false,
   cookie: {
    maxAge: 30 * 60 * 1000  // 30 minutes in milliseconds
  }
}));
//helmet security lagane ke liye middleware
app.use(helmet());
import path from 'path'
import { getJobs, postJob ,cDashboard,Rdashboard,view,apply,saveJob,aplyed,savedJobs,updateJob,profile,CandidateUpdate,filter,viewPosted,Applicants,deleteApply,deleteSaved,deletePostedJob,EditPostedJob,Accept,Reject,viewCandidate} from './controllers/jobController.js';
import {candidateLogin,c_register,recruiterRegister,recruiterLogin} from './src/auth.js';
const dbName="demo"
const ab=path.resolve('../frontend/public')
app.use(express.static(ab))
app.set('views', path.resolve('../frontend/views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
connectDB();
app.get("/",(req,resp)=>{
    resp.render("index")
})
//profile show karane ke liye hai ye route
app.get("/candidate/profile",profile)
//ye candidate ki information ko update karne ke liye 
app.post("/candidate/update",CandidateUpdate)

app.get("/candidate/register",(req,resp)=>{
    resp.render("candidate_register")
})
//applyed jobs ko check karna dashboard se
app.get("/3",aplyed);
//saved jobs ko check karne ke liye
app.get("/savedJobs",savedJobs);
// app.get("/savejob/:id",saveJob)
app.get("/candidate/login",(req,resp)=>{
    resp.render('candidateLogin.ejs')
})
//Applyed job ko delete karne ke liye
app.get("/deleteAppled/:id",deleteApply)
//saved jobs ko delete karne ke liye
app.get("/deleteSaved/:id",deleteSaved)
//postedJob ko delete karne ke liye
app.get("/deletePosted/:id",deletePostedJob)
//Edit posted jobs
app.get("/EditPostedJob/:id",EditPostedJob)
//updated post request for updateJob
app.post("/recruiter/updateJob",updateJob)
//Accept candidate for job
app.get("/Accept/:id",Accept)
//Reject candidate for job
app.get("/Reject/:id",Reject)
//candidate ki profile view karne ke liye
app.post("/viewCandidate",viewCandidate)
app.get("/candidate/applied-jobs",(req,resp)=>{
    resp.render('cnadidate_applied')
})
app.get("/recruiter/login",(req,resp)=>{
    resp.render('recuiter_login')
})
app.get("/recruiter/post-job",(req,resp)=>{
    resp.render('recuiter_postJob')
})
app.get('/candidate/view-jobs', getJobs);
app.post("/recruiter/post-job",postJob)
app.get("/recruiter/view-applicants",Applicants)
app.post("/recruiter/login1",recruiterLogin)//isper
//recruiter login ke liye hai ye
app.get("/Rdashboard",Rdashboard);
app.post("/12",candidateLogin)
app.post("/filter",filter)//filter karne ke liye jobs ko
app.get("/dashboard",cDashboard)
app.post("/recruiter/register1",recruiterRegister)
app.post("/candidate/register",c_register)
app.get("/viewpostedJob/:id",view)
//job apply karne ke liye route
app.get("/applyforjob/:id",apply)
app.get("/saveJob/:id",saveJob)
app.get("/recruiter/view-posted-jobs",viewPosted)
app.get("/recruiter/register",(req,resp)=>{
    resp.render('recuiter_register')
})

app.listen(3100)
