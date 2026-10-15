import { NextRequest, NextResponse } from "next/server";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: GenerateProjectDescriptionBody = await req.json();
        const { experienceLevel, jobTitle, techStack } = body;

        if (!experienceLevel || !jobTitle || !techStack) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

let prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Generate a professional ATS friendly project description for a resume using the details below.

JOB TITLE: ${jobTitle}
EXPERIENCE LEVEL: ${experienceLevel}
TECH STACK USED IN THE PROJECT: ${techStack.join(", ")}

OUTPUT RULES:
- Output ONLY the project description. No title, heading, label, preamble, explanation, or closing remarks.
- Write exactly 3 to 4 bullet points, each on a new line starting with "- ".
- Each bullet must be one sentence of 15 to 25 words.
- Total length must be between 60 and 90 words.
- No markdown formatting (no bold, asterisks, headings), no quotation marks, and no emojis.
- Do not use first-person pronouns ("I", "my", "we").

CONTENT RULES:
- Start every bullet with a different strong action verb in past tense (e.g. Developed, Built, Implemented, Designed, Integrated, Optimized).
- Write the description so it matches the responsibilities of a ${jobTitle} at the ${experienceLevel} level. Keep the complexity realistic for that level.
- Since no project name or overview is given, describe a realistic project that fits this job title and tech stack, using only generic features (for example authentication, dashboards, API integration, responsive UI, data management).
- Naturally include every technology from the tech stack as a keyword, using the exact spelling given. Do not repeat the same technology in every bullet.
- Use industry-standard terminology that ATS systems scan for.
- Do NOT invent numbers, percentages, user counts, company names, or measurable achievements.
- Do NOT add technologies that were not provided.
- Tone: professional, specific, concise.
`;

        const result = await generateAiContent(prompt);

        let projectDescription = result;

    
        return NextResponse.json<ApiResponse>({
            success: true,
            message: "project description created successfully",
            data: { projectDescription },
        }, { status: 201 })


    } catch (error) {
        console.log("error in generate project description api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate project description",
        }, { status: 500 })
    }
}