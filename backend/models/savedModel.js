
import mongoose from "mongoose";
const SavedSchema = new mongoose.Schema({
title:String,
company:String,
location:String,
description:String,
salary:String,
candidate:String,
jobId:String,
status:String,
name:String

});
export default mongoose.model("saveJob", SavedSchema);
