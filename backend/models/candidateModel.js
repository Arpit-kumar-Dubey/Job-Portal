import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    skills:String,
    degree:String,
    field:String,
    gradYear:String,
    university:String,
    location:String,
    phone:String,
    company:String,
    endDate:String,
    expDescription:String,
    jobTitle:String,
    startDate:String
});

export default mongoose.model("Candidates", candidateSchema);
