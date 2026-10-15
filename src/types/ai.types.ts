export interface GenerateSummaryBody {
    experienceLevel: string;
    skills: string[];
    jobTitle: string;

}


export interface GenerateSkillsBody {
    experienceLevel: string;
    jobTitle: string;
}
export interface GenerateProjectDescriptionBody {
    experienceLevel: string;
    jobTitle: string;
    techStack: string[];
}

export interface GenerateExperienceDescriptionBody {
    experienceLevel: string;
    jobRole: string;
    techStack: string[];
    yearsOfExperience: number;
}

export interface ImproveContentBody {
    content: string;
}

export interface ATSScoreBody {
    resumeText: string;
}