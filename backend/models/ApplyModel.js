
import mongoose from "mongoose";
const ApplySchema = new mongoose.Schema({
title:String,
company:String,
location:String,
description:String,
salary:String,
RecruiterId:String,
candidate:String,
jobId:String,
status:String,
name:String,    
locationCandidate:String,
appliedAt:String
});
export default mongoose.model("applyJob", ApplySchema);