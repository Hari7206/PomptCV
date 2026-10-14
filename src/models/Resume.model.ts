import mongoose from "mongoose";
import { IResume } from "../types/resume.types";


const  resumeSchema = new mongoose.Schema<IResume>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        default: ""
    },
    summary: {
        type: String,
        default: ""
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            mobile: String,
            location: String,
            github: String,
            linkedin: String,
            portfolio: String,
        } ,
        default: {}
    },
    workExperience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                description: String,
            }
        ],
        default: []
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                techStack: [String],
                githubUrl: String,
                liveUrl: String,
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
    education: {
        type: [
            {   
                institution: String,
                degree: String,
                startDate: String,
                endDate: String,
                description: String,
            }
        ],
        default: []
    }

},{
    timestamps: true
});


const ResumeModel = mongoose.model("Resume", resumeSchema);

export default ResumeModel;