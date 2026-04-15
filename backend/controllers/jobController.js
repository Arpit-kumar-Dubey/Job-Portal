import AppliedJob from '../models/ApplyModel.js';
import Candidate from '../models/candidateModel.js';
import PostedJob from '../models/postedModel.js'; 
import Recruiter from '../models/recruiterModel.js';
import SavedJob from '../models/savedModel.js';


export const getJobs = async (req, res) => {
    try {
        const data = await PostedJob.find();
        res.render("recuiter_postedJob", { data });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching jobs");
    }
};


export const postJob = async (req, res) => {
    try {
        if (!req.session.email) {
            return res.send('<script>alert("Session Expired"); window.location.href="/recruiter/login";</script>');
        }
        const newJ = {
            ...req.body,
            RecruiterId: req.session.email,
            postedDate: new Date().toISOString().split("T")[0]
        };
        await PostedJob.create(newJ);
        res.redirect("/Rdashboard");
    } catch (error) {
        res.status(500).send("Error posting job");
    }
};

export const Applicants = async (req, resp) => {
    try {
        if (!req.session.email) {
            return resp.send(`
                <script>
                    alert("Session Expired");
                    window.location.href = "/recruiter/login";
                </script>
            `);
        }
        const email = req.session.email;
        const data = await AppliedJob.find({ RecruiterId: email });
        resp.render("recuiter_viewApplicant", { data: data });
    } catch (error) {
        console.log(error);
        resp.send("internal error in your Applicants code");
    }
};


export const savedJobs = async (req, resp) => {
    const email = req.session.userId;
    const data = await SavedJob.find({ candidate: email });
    if (!data || data.length === 0) return resp.redirect("/dashboard");
    resp.render("candidate_savedJobs", { data });
};
export const EditPostedJob = async (req, resp) => {
    try {
        const id = req.params.id;

        
        if (!req.session.email) {
            return resp.send(`
                <script>
                    alert("Session expired! Please login again.");
                    window.location.href = "/recruiter/login";
                </script>
            `);
        }
        const result2 = await PostedJob.findById(id);

        if (!result2) {
            return resp.send("Job not found");
        }
        resp.render("recruiter_updateJob", { result: result2 });

    } catch (error) {
        console.log(error);
        resp.status(500).send("some internal error in your EditPostedJob function");
    }
};
export const view = async (req, resp) => {
    try {
        const id = req.params.id;
        const job = await PostedJob.findById(id);

        if (!job) {
            return resp.status(404).send("Job not found");
        }

        resp.render("viewpostedJob", { job });

    } catch (error) {
        console.log(error);
        resp.status(500).send("there is some internal error in your viewpostedjob function");
    }
};
export const viewPosted = async (req, resp) => {
    try {

        if (!req.session.email) {
            return resp.send(`
                <script>
                    alert("Session Expired! Please login again.");
                    window.location.href = "/recruiter/login";
                </script>
            `);
        }
        const email = req.session.email;

        // 2. Mongoose query: posetdJob collection se recruiter ke jobs nikalna
        // find() use karenge kyunki ek recruiter ke multiple jobs ho sakte hain
        const data = await PostedJob.find({ RecruiterId: email });

        // 3. Check if jobs exist
        if (!data || data.length === 0) {
            return resp.send(`
                <script>
                    alert("You have no posted jobs yet.");
                    window.location.href = "/Rdashboard";
                </script>
            `);
        }

        

        resp.render("recuiter_postedJob", { data: data });

    } catch (error) {
        console.log(error);
        resp.send("internal problem in your viewPosted code");
    }
};

export const aplyed = async (req, resp) => {
    const email = req.session.userId;
    const data = await AppliedJob.find({ candidate: email });
    if (!data || data.length === 0) return resp.redirect("/dashboard");
    resp.render("candidate_viewJobs", { data });
};

// 5. Candidate Profile 
export const profile = async (req, resp) => {
    try {
        const email = req.session.userId;
        const user = await Candidate.findOne({ email });
        if (!user) {
            return resp.send('<script>alert("Session Expired"); window.location.href="/candidate/login";</script>');
        }
        resp.render('candidate_profile', { candidate: user });
    } catch (error) {
        resp.status(500).send("Internal error in profile");
    }
};


export const CandidateUpdate = async (req, resp) => {
    try {
        const id = req.session.candidateId;
        if (!id) {
            return resp.send('<script>alert("Session Expired"); window.location.href="/candidate/login";</script>');
        }
        await Candidate.findByIdAndUpdate(id, { $set: req.body });
        resp.redirect("/candidate/profile");
    } catch (error) {
        resp.status(500).send("Error in candidateUpdate");
    }
};


export const cDashboard = async (req, resp) => {
    try {
        const email = req.session.userId;
        if (!email) return resp.send('<script>alert("No email found"); window.location.href="/candidate/login";</script>');

        const data1 = await AppliedJob.find({ candidate: email });
        const applycount = await AppliedJob.countDocuments({ candidate: email });
        const savecount = await SavedJob.countDocuments({ candidate: email });
        const user = await Candidate.findOne({ email });
        const jobs = await PostedJob.find();

        resp.render("candidate_dashboard", { jobs:jobs, name: user.name, applyed: applycount, save: savecount, apply: data1 });
    } catch (error) {
        resp.status(500).send("Internal error");
    }
};


export const filter = async (req, resp) => {
    try {
        const { title } = req.body;
        if (!title) return resp.redirect("/dashboard");
        const email = req.session.userId;
        const data1 = await AppliedJob.find({ candidate: email });
        const applycount = await AppliedJob.countDocuments({ candidate: email });
        const savecount = await SavedJob.countDocuments({ candidate: email });
        const user = await Candidate.findOne({ email });
        const jobs = await PostedJob.find({ title: { $regex: title, $options: 'i' } });

        resp.render("candidate_dashboard", { jobs, name: user.name, applyed: applycount, save: savecount, apply: data1 });
    } catch (error) {
        resp.status(500).send("Internal filter error");
    }
};


export const apply = async (req, resp) => {
    try {
        const email = req.session.userId;
        const user = await Candidate.findOne({ email });
        const jobResult = await PostedJob.findById(req.params.id);
        
        if (!jobResult) return resp.status(404).send("Job not found");

        const find = await AppliedJob.findOne({ jobId: req.params.id, candidate: email });
        if (find) return resp.redirect("/dashboard");

        const applicationData = {
            ...jobResult._doc,
            candidate: email,
            jobId: req.params.id,
            status: "pending",
            name: user.name,
            locationCandidate: user.location || "not updated",
            appliedAt: new Date().toISOString().split("T")[0]
        };
        delete applicationData._id;

        await AppliedJob.create(applicationData);
        resp.redirect("/dashboard");
    } catch (error) {
        resp.status(500).send("Error applying");
    }
};
export const saveJob = async (req, resp) => {
    try {
        const email = req.session.userId;
        const jobResult = await PostedJob.findById(req.params.id);
        if (!jobResult) return resp.status(404).send("Job not found");

        const find = await SavedJob.findOne({ jobId: req.params.id, candidate: email });
        if (find) return resp.redirect("/dashboard");

        const saveData = { ...jobResult._doc, candidate: email, jobId: req.params.id };
        delete saveData._id;

        await SavedJob.create(saveData);
        resp.redirect("/dashboard");
    } catch (error) {
        resp.status(500).send("Error saving job");
    }
};
export const Rdashboard = async (req, resp) => {
    try {
        const email = req.session.email;
        if (!email) return resp.send('<script>alert("Session Expired"); window.location.href="/recruiter/login";</script>');

        const applicants = await AppliedJob.find({ RecruiterId: email });
        const countPosted = await PostedJob.countDocuments({ RecruiterId: email });
        const countApplicants = await AppliedJob.countDocuments({ RecruiterId: email });
        const job = await PostedJob.find({ RecruiterId: email });
        const user = await Recruiter.findOne({ email });

        resp.render('recuiter_dashboard', { name: user.name, job, user1: applicants, Applicants: countApplicants, posted: countPosted });
    } catch (error) {
        resp.status(500).send("Dashboard error");
    }
};

export const deleteApply = async (req, resp) => {
    await AppliedJob.findByIdAndDelete(req.params.id);
    resp.redirect("/3");
};

export const deleteSaved = async (req, resp) => {
    await SavedJob.findByIdAndDelete(req.params.id);
    resp.redirect("/savedJobs");
};

export const deletePostedJob = async (req, resp) => {
    const id = req.params.id;
    await SavedJob.deleteMany({ jobId: id });
    await AppliedJob.deleteMany({ jobId: id });
    await PostedJob.findByIdAndDelete(id);
    resp.redirect("/Rdashboard");
};

export const updateJob = async (req, resp) => {
    try {
        const { id } = req.body;
        if (!req.session.email) return resp.send('<script>alert("Session Expired"); window.location.href="/recruiter/login";</script>');
        
        await PostedJob.findByIdAndUpdate(id, { $set: req.body });
        resp.redirect("/Rdashboard");
    } catch (error) {
        resp.status(500).send("Update error");
    }
};

export const Accept = async (req, resp) => {
    await AppliedJob.findByIdAndUpdate(req.params.id, { status: "Accepted" });
    resp.redirect("/Rdashboard");
};

export const Reject = async (req, resp) => {
    await AppliedJob.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    resp.redirect("/Rdashboard");
};

export const viewCandidate = async (req, resp) => {
    try {
        const { Email, idJob } = req.body;
        const user = await Candidate.findOne({ email: Email });
        resp.render("viewCandidateProfile", { user, idJob });
    } catch (error) {
        resp.status(500).send("Error viewing candidate");
    }
};
