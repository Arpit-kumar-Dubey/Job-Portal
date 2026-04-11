import express from 'express'
const app=express();
import helmet from "helmet";
import session from "express-session";
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
import bcrypt from 'bcrypt';
import path from 'path'
import { MongoClient,ObjectId, } from 'mongodb';
import { json } from 'stream/consumers'; 
import { getJobs, postJob ,cDashboard,Rdashboard,view,apply,saveJob,aplyed,savedJobs,profile,CandidateUpdate,filter} from './controllers/jobController.js';
import {candidateLogin,c_register,recruiterRegister,recruiterLogin} from './src/auth.js';
const dbName="demo"
const ab=path.resolve('public')
app.use(express.static(ab))
app.set('view engine','ejs')
const url="mongodb://localhost:27017"
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const client=new MongoClient(url)
client.connect().then((connection)=>{
const db=connection.db(dbName);
app.locals.db = db;
app.get("/",(req,resp)=>{
    resp.render("index")
})
//profile show karane ke liye hai ye route
app.get("/candidate/profile",profile)
//ye candidate ki information ko update karne ke liye 
app.post("/candidate/update",CandidateUpdate)
app.get("/recruiter/register",(req,resp)=>{
    resp.render('recuiter_register')
})
app.get("/candidate/register",(req,resp)=>{
    resp.render("candidate_register")
})
//applyed jobs ko check karna dashboard se
app.get("/3",aplyed);
//saved jobs ko check karne ke liye
app.get("/savedJobs",savedJobs);
app.get("/candidate/login",(req,resp)=>{
    resp.render('candidateLogin.ejs')
})
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
app.get("/recruiter/view-applicants",async(req,resp)=>{
const collection=db.collection("products")
const products= await collection.find().toArray()
resp.render('recuiter_viewApplicant',{products})
})
app.post("/recruiter/login1",recruiterLogin,Rdashboard)
//recruiter login ke liye hai ye
app.post("/12",candidateLogin)
app.post("/filter",filter)//filter karne ke liye jobs ko
app.get("/dashboard",cDashboard)
app.post("/recruiter/register1",recruiterRegister)
app.post("/candidate/register",c_register)
app.get("/viewpostedJob/:id",view)
//job apply karne ke liye route
app.get("/applyforjob/:id",apply)
})
app.get("/savejob/:id",saveJob)
app.listen(3200)
