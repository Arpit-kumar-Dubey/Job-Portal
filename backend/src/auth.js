import bcrypt from 'bcrypt';
import Candidate from '../models/candidateModel.js';
import Recruiter from '../models/recruiterModel.js';
export const recruiterLogin=async(req,resp)=>{
    try{
        const{email,password}=req.body
        const user= await Recruiter.findOne({email:email})
         if (!user){
           return resp.redirect("/recruiter/login?error=Invalid password or Email");
        }
        if(!await bcrypt.compare(password,user.password)){
          return resp.redirect("/recruiter/login?error=Invalid password or Email");
        }else{
        req.session.Rid=user._id;
        req.session.email=email;
        resp.redirect("/Rdashboard")
        }
    }catch(error){
        console.log(error)
        resp.status(500).send("there are some internal error")
    }
};
export const recruiterRegister=async(req,resp)=>{
    try{
        const db=req.app.locals.db;
        const {name,email,password}=req.body
        const user=await Recruiter.findOne({email:email})
        const salt= await bcrypt.genSalt(10)
        const hashed=await bcrypt.hash(password,salt)
        const newUser={
            name,
            email,
            password:hashed
        }
        if(!user){
        const result=await Recruiter.create(newUser)
        resp.render('index')
        }else{
           return resp.redirect("/recruiter/register?error=User Already Exist");
        }
        
        
    }catch(error){
        resp.status(500).send("there are some error in your internal code")
    }
};
export const c_register=async(req,resp)=>{
    try{
        const {name,email,password}=req.body
    
        const user=await Candidate.findOne({email:email})
        if(!user){
        const salt=await bcrypt.genSalt(10);
        const hashed=await bcrypt.hash(password,salt);
        const newuser={
           name,email,password:hashed
        }
        const result=await Candidate.create(newuser)
        resp.render("index")
        }else{
          return resp.redirect("/candidate/register?error=User Already Exist");
        }
        

    }catch(error){
        console.log(error)
        resp.status(500).send("their are some internal error")
    }
};
export const candidateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
      
        const user = await Candidate.findOne({ email: email });

        if (!user) {
              return res.redirect("/candidate/login?error=Invalid password or Email");
        }
        if (!await bcrypt.compare(password,user.password)){
             return res.redirect("/candidate/login?error=Invalid password or Email");
        }
        req.session.userId=email;
        req.session.candidateId=user._id;
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.status(500).send("There is some internal error");
    }
};
//user.password !== password
