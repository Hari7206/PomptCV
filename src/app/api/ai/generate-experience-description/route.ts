import { NextRequest, NextResponse } from "next/server";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: GenerateExperienceDescriptionBody = await req.json();
        const { experienceLevel, jobRole, techStack, yearsOfExperience } = body;

        if (!experienceLevel || !jobRole || !techStack || !yearsOfExperience) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

let prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Generate a professional ATS friendly work experience description for a resume using the details below.

JOB ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel}
YEARS OF EXPERIENCE: ${yearsOfExperience}
TECH STACK USED AT WORK: ${techStack.join(", ")}

OUTPUT RULES:
- Output ONLY the work experience description. No title, heading, label, preamble, explanation, or closing remarks.
- Write exactly 4 to 5 bullet points, each on a new line starting with "- ".
- Each bullet must be one sentence of 15 to 25 words.
- Total length must be between 70 and 110 words.
- No markdown formatting (no bold, asterisks, headings), no quotation marks, and no emojis.
- Do not use first-person pronouns ("I", "my", "we").
- Use past tense for all bullets.

CONTENT RULES:
- Start every bullet with a different strong action verb (e.g. Developed, Built, Implemented, Collaborated, Optimized, Designed, Maintained).
- Match the scope and seniority of the responsibilities to the ${experienceLevel} level and ${yearsOfExperience} of experience as a ${jobRole}. Entry level roles should focus on assisting, building, and learning. Mid level roles should show ownership of features. Senior level roles may show leading, mentoring, and architecture.
- Naturally include every technology from the tech stack as a keyword, using the exact spelling given. Do not repeat the same technology in every bullet.
- Use industry-standard terminology that ATS systems scan for.
- Cover a mix of: building or delivering features, working with the listed tech stack, collaborating with teams, and code quality or process improvement.
- Do NOT invent numbers, percentages, revenue, user counts, team sizes, or measurable achievements.
- Do NOT mention any company name.
- Do NOT add technologies that were not provided.
- Tone: professional, specific, concise.
`;

        const result = await generateAiContent(prompt);

        let workExperienceDescription = result;

    
        return NextResponse.json<ApiResponse>({
            success: true,
            message: "work experience description created successfully",
            data: { workExperienceDescription },
        }, { status: 201 })


    } catch (error) {
        console.log("error in generate work experience description api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate work experience description",
        }, { status: 500 })
    }
}