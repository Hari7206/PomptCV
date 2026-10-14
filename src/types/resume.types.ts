import { Types } from "mongoose";

export interface IPerosnalInfo{
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
}


export interface IWorkExperience{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    responsibilities: string[];
}



export interface IProjects{
    title: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techStack: string[];
}


export interface IEducation{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface IResume{
   _id?: string;
   userId: Types.ObjectId;
   title: string;
   summary: string;
   personalInfo: IPerosnalInfo;
   workExperience?: IWorkExperience[];
   projects: IProjects[];
   skills: string[];
   education: IEducation[];
   certifications?: string[];
   createdAt?: Date;
   updatedAt?: Date;
}