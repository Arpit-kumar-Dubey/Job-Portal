

import { ObjectId } from "mongodb";

export const getJobs = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const collection = db.collection("postedJob");

        const data = await collection.find().toArray();

        res.render("recuiter_postedJob", { data });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching jobs");
    }
};

export const postJob = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const collection = db.collection("posetdJob");

        const result = await collection.insertOne(req.body);

        console.log(result);
        res.send("data is added");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error posting job");
    }
};

export const savedJobs=async(req,resp)=>{
     const email=req.session.userId 
   const db=req.app.locals.db;
   const saved=db.collection("saveJob")
   const data=await saved.find({candidate:email}).toArray();
   if(!data){
    resp.redirect("/dashboard")
   }
   console.log(data)
   resp.render("candidate_savedJobs",{data:data})

}
export const aplyed=async(req,resp)=>{
    const email=req.session.userId 
   const db=req.app.locals.db;
   const apply=db.collection("applyJob")
   const data=await apply.find({candidate:email}).toArray();
   if(!data){
    resp.redirect("/dashboard")
   }
   console.log(data)
   resp.render("candidate_viewJobs",{data:data})


}
export const profile=async(req,resp)=>{
    try{
        const db=req.app.locals.db;
        const email=req.session.userId
        const collection=db.collection('candidates')
        const user=await collection.findOne({email:email})
        if(!user){
            resp.send("Session expired")
        }
        resp.render('candidate_profile',{candidate:user})

    }catch(error){
        console.log(error)
        resp.status(500).send("some internal error in profile function")
    }
}
export const CandidateUpdate=async(req,resp)=>{
    try{
        const id=req.session.candidateId;
        const user=req.body;
        const db=req.app.locals.db
        if(!id){
            resp.send("session expired")
        }
        const collection=db.collection('candidates')
       const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) }, // ID ko ObjectId mein convert karna zaroori hai
            { $set: user },
            { returnDocument: 'after' } // Ye Mongoose ke { new: true } jaisa kaam karta hai
        );
        resp.redirect("/candidate/profile")

    }catch(error){
        console.log(error)
        resp.status(500).send("there are some internal error in your candidateUpdate ")
    }
}
export const cDashboard=async(req,resp)=>{
try{
    if(!req.session.userId){
        resp.send("no email found")
    }
   const email=req.session.userId 
   const db=req.app.locals.db;
   const apply=db.collection("applyJob")
   const data1=await apply.find({candidate:email}).toArray()
   const save=db.collection("saveJob")
   const applycount = await apply.countDocuments({candidate:email});
   const savecount = await save.countDocuments({candidate:email});
     const collection=db.collection("posetdJob")
     const collection1 = db.collection("candidates");
     const user=await collection1.findOne({email:email})
     const Name=user.name;
    const jobs=await collection.find().toArray();
    resp.render("candidate_dashboard",{jobs:jobs,name:Name,applyed:applycount,save:savecount,apply:data1})

}catch(error){
    console.log(error)
    resp.status(500).send("there are some internal error")
}
};
export const filter=async(req,resp)=>{
try{
    if(!req.session.userId){
        resp.send("no email found")
    }
   const {title}=req.body;
   if(!title){
    return resp.redirect("/dashboard")
   }
   const email=req.session.userId 
   const db=req.app.locals.db;
   const apply=db.collection("applyJob")
   const data1=await apply.find({candidate:email}).toArray()
   const save=db.collection("saveJob")
   const applycount = await apply.countDocuments({candidate:email});
   const savecount = await save.countDocuments({candidate:email});
     const collection=db.collection("posetdJob")
     const collection1 = db.collection("candidates");
     const user=await collection1.findOne({email:email})
     const Name=user.name;
    const jobs=await collection.find({ title: { $regex: title} }).toArray();
    resp.render("candidate_dashboard",{jobs:jobs,name:Name,applyed:applycount,save:savecount,apply:data1})
//{ field: { $regex: "pattern", $options: "i" } }
}catch(error){
    console.log(error)
    resp.status(500).send("there are some internal error")
}
};

export const apply = async (req, resp) => {
    try {
        const email = req.session.userId;
        const db = req.app.locals.db;
        
        const jobsCollection = db.collection("posetdJob");
        const applicationsCollection = db.collection("applyJob"); 
        const jobResult = await jobsCollection.findOne({ _id: new ObjectId(req.params.id) });
        
        if (!jobResult) {
            return resp.status(404).send("Job not found");
        }
        const jobId = req.params.id;
        const applicationData = {
            ...jobResult,
            candidate: email,
            jobId:jobId,
            status:"pending",
            appliedAt: new Date()
        };
       
        delete applicationData._id;
        const find=await applicationsCollection.findOne({jobId:jobId,candidate:email})
        if(find){
            return resp.redirect("/dashboard");
        }
        await applicationsCollection.insertOne(applicationData);
        resp.redirect("/dashboard");

    } catch (error) {
        console.log("THE EXACT ERROR IS:", error);
        resp.status(500).send("some internal error");
    }
}
export const saveJob = async (req, resp) => {
    try {
        const email = req.session.userId;
        const db = req.app.locals.db;
        
        const jobsCollection = db.collection("posetdJob");
        const applicationsCollection = db.collection("saveJob"); 
        const jobResult = await jobsCollection.findOne({ _id: new ObjectId(req.params.id) });
        
        if (!jobResult) {
            return resp.status(404).send("Job not found");
        }
        const jobId = req.params.id;
        const applicationData = {
            ...jobResult,
            candidate: email,
            jobId:jobId
        };
       
        delete applicationData._id;
        const find=await applicationsCollection.findOne({jobId:jobId,candidate:email})
        if(find){
            return resp.redirect("/dashboard");
        }
        await applicationsCollection.insertOne(applicationData);
        resp.redirect("/dashboard");

    } catch (error) {
        console.log("THE EXACT ERROR IS:", error);
        resp.status(500).send("some internal error");
    }
}

export const Rdashboard=async(req,resp)=>{
    try{
        const {email}=req.body;
        const db=req.app.locals.db
        const collection1=db.collection("posetdJob")
        const job=await collection1.find().toArray();
        const collection=db.collection('recruiter')
        const user= await collection.findOne({email:email})
        const Name=user.name
        resp.render('recuiter_dashboard',{name:Name,job:job})

    }catch(error){
        console.log(error)
        resp.status(500).send("there are some error in internal code")
    }
};
export const view=async(req,resp)=>{
    try{
    const db=req.app.locals.db;
    const collection=db.collection('posetdJob')
    const job=await collection.findOne({_id:new ObjectId(req.params.id)})
    resp.render("viewpostedJob",{job})
    }catch(error){
        console.log(error)
        resp.status(500).send("there is some internal error in your viewpostedjob function")
    }

}

