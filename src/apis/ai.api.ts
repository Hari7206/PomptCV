import axios from "axios";

export const generateSummaryApi = async (payload: {
  jobTitle: string;
  experienceLevel: string;
  skills: string[];
}) => {
  const response = await axios.post("/api/ai/generate-summary", payload);

  return response.data;
};

export const generateSkillsApi = async (payload: {
  jobTitle: string;
  experienceLevel: string;
}) => {
  const response = await axios.post("/api/ai/generate-skills", payload);

  return response.data;
};


export const generateExperienceApi = async (payload: {
  jobRole: string;
  experienceLevel: string;
  techStack?: string[];
  yearsOfExperience?: number;
}) => {
  const response = await axios.post("/api/ai/generate-experience", payload);

  return response.data;
};


export const generateProjectDescriptionApi = async (payload: {
  jobRole: string;
  projectTitle: string;
  techStack: string[];
}) => {
  const response = await axios.post(
    "/api/ai/generate-project-description",
    payload
  );

  return response.data;
};


export const improveContentApi = async (payload: { content: string }) => {
  const response = await axios.post("/api/ai/improve-content", payload);

  return response.data;
};


export const getATSScoreApi = async (payload: { resumeText: string }) => {
  const response = await axios.post("/api/ai/ats-score", payload);

  return response.data;
};