import mongoose from "mongoose";
const PostedSchema = new mongoose.Schema({
title:String,
company:String,
location:String,
description:String,
salary:String,
candidate:String,
jobId:String,
status:String,
RecruiterId:String,
postedDate:String

});
export default mongoose.model("posetdJob", PostedSchema);
