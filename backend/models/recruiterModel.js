import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema({
 
name:String,
email:String,
password:String
});

export default mongoose.model("recruiter", RecruiterSchema);
