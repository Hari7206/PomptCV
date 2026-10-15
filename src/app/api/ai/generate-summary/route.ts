import { NextRequest, NextResponse } from "next/server";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: GenerateSummaryBody = await req.json();
        const { experienceLevel, skills, jobTitle } = body;

        if (!experienceLevel || !skills || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

        let prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Generate a professional ATS friendly resume summary using the details below.

JOB TITLE: ${jobTitle}
EXPERIENCE LEVEL: ${experienceLevel}
SKILLS: ${skills.join(", ")}

OUTPUT RULES:
- Output ONLY the summary text. No title, heading, label, preamble, explanation, or closing remarks.
- Single paragraph, 3 to 4 sentences.
- The summary MUST be between 50 and 80 words. Never fewer than 50, never more than 80. Aim for about 65 words.
- No markdown, bullet points, asterisks, quotation marks, or emojis.
- Do not use first-person pronouns ("I", "my", "me"). Use implied first person, e.g. "Results-driven ${jobTitle} with...".

CONTENT RULES:
- Start with the job title and experience level.
- Naturally include the provided skills as keywords, using the exact spelling given. Do not stuff or repeat them.
- Use strong action-oriented language and industry-standard terminology that ATS systems scan for.
- Highlight the value delivered (e.g. building scalable applications, improving performance, collaborating with teams).
- Do NOT invent numbers, company names, degrees, certifications, or achievements that were not provided.
- Do NOT add skills that were not provided.
- Tone: professional, confident, concise.
`;


        const result = await generateAiContent(prompt);

        const summary = result;

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Summary created successfully",
            data: { summary },
        }, { status: 201 })


    } catch (error) {
        console.log("error in generate summary api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate summary",
        }, { status: 500 })
    }
}