import express from 'express'
const app=express();
import path from 'path'
import { MongoClient } from 'mongodb';
import { json } from 'stream/consumers';
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
app.get("/",(req,resp)=>{
    resp.render("index")
})
app.get("/1",(req,resp)=>{
    resp.render('candidate_apply')
})
app.get("/candidate/register",(req,resp)=>{
    resp.render('candidate_register.ejs')
})
app.get("/3",(req,resp)=>{
    resp.render('candidate_viewJobs.ejs')
})
app.get("/candidate/login",(req,resp)=>{
    resp.render('candidateLogin.ejs')
})
app.get("/5",(req,resp)=>{
    resp.render('cnadidate_applied.ejs')
})
app.get("/6",(req,resp)=>{
    resp.render('login.ejs')
})
app.get("/recruiter/login",(req,resp)=>{
    resp.render('recuiter_login.ejs')
})
app.get("/8",(req,resp)=>{
    resp.render('recuiter_postJob')
})
app.get("/9",async(req,resp)=>{
    const collection=db.collection("posetdJob")
    const data=await collection.find().toArray();
    resp.render('recuiter_postedJob.ejs',{data})
})
app.post("/recruiter/post-job",async(req,resp)=>{
    const collection=db.collection("posetdJob")
    const result=await collection.insertOne(req.body)
    console.log(JSON.stringify(result,null,2))
    resp.send("data is added")
})
app.get("/recruiter/register",(req,resp)=>{
    resp.render('recuiter_register.ejs')
})
app.get("/11",async(req,resp)=>{
    const collection=db.collection("products")
    const products= await collection.find().toArray()

    resp.render('recuiter_viewApplicant.ejs',{products})
})
app.get("/12",async(req,resp)=>{
    const collection=db.collection("posetdJob")
    const jobs=await collection.find().toArray();
    resp.render("candidate_dashboard",{jobs})
   
})
app.get("/13",(req,resp)=>{
    resp.render("recuiter_dashboard")
})
app.post("/candidate/register",async(req,resp)=>{
     const collection=db.collection("candidates")
     const result=await collection.insertOne(req.body)
     resp.render("index")
})
})
app.listen(3200)
