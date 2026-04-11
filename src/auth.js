import bcrypt from 'bcrypt';
export const recruiterLogin=async(req,resp,next)=>{
    try{
        const{email,password}=req.body
        const db=req.app.locals.db
        const collection=db.collection('recruiter')
        const user=collection.findOne({email:email})
         if (!user){
            return resp.send("User not found");
        }
        next();
    }catch(error){
        console.log(error)
        resp.status(500).send("there are some internal error")
    }
};
export const recruiterRegister=async(req,resp)=>{
    try{
        const db=req.app.locals.db;
        const {email}=req.body
        const collection=db.collection('recruiter')
        const user=await collection.findOne({email:email})
        if(!user){
        const result=await collection.insertOne(req.body)
        resp.render('index')
        }else{
            return resp.json({message: "User already exists" });
        }
        
        
    }catch(error){
        resp.status(500).send("there are some error in your internal code")
    }
};
export const c_register=async(req,resp)=>{
    try{
        const {name,email,password}=req.body
        const db=req.app.locals.db;
        const collection=db.collection('candidates')
        const user=await collection.findOne({email:email})
        if(!user){
        const salt=await bcrypt.genSalt(10);
        const hashed=await bcrypt.hash(password,salt);
        const newuser={
           name,email,password:hashed
        }
        const result=await collection.insertOne(newuser)
        resp.render("index")
        }else{
           return resp.json({ message: "User already exists" });
        }
        

    }catch(error){
        console.log(error)
        resp.status(500).send("their are some internal error")
    }
};
export const candidateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = req.app.locals.db;
        const collection = db.collection("candidates");
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.send("email not found");
        }
        if (!await bcrypt.compare(password,user.password)){
            return res.send("Invalid password");
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