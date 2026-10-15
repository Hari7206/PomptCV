import { NextRequest, NextResponse } from "next/server";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: ImproveContentBody = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

        let prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Improve the resume content below so it is professional, clear, and ATS friendly.

CONTENT TO IMPROVE:
${content}

OUTPUT RULES:
- Output ONLY the improved content. No title, heading, label, preamble, explanation, notes, or closing remarks.
- Keep the same format as the original. If the original is bullet points, return bullet points, each on a new line starting with "- ". If it is a paragraph, return a paragraph.
- Keep the length close to the original (within 20% longer or shorter). Do not turn short content into long content.
- No markdown formatting (no bold, asterisks, headings, tables), no quotation marks, and no emojis.
- Do not use first-person pronouns ("I", "my", "we").
- Use past tense for past roles and projects, and present tense for current roles.

CONTENT RULES:
- Preserve the original meaning. Keep every fact, technology, tool, number, and achievement that is in the original.
- Do NOT invent numbers, percentages, company names, technologies, certifications, or achievements that are not in the original.
- Fix grammar, spelling, punctuation, and awkward phrasing.
- Replace weak or vague phrases (for example "worked on", "helped with", "responsible for") with strong action verbs (for example Developed, Built, Implemented, Optimized, Collaborated, Designed).
- Start each bullet with a different action verb where possible.
- Use industry-standard terminology and keywords that ATS systems scan for, but only where they fit what the original already says.
- Remove filler words, repetition, and unnecessary details.
- Make each sentence concise, specific, and results-oriented without adding unsupported claims.
- Tone: professional, confident, concise.
- If the content is too vague or too short to improve meaningfully, make only safe grammar and wording improvements and return it without adding new details.
`;


        const result = await generateAiContent(prompt);

        const improvedContent = result;

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Improved content created successfully",
            data: { improvedContent },
        }, { status: 201 })


    } catch (error) {
        console.log("error in improve content api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate improved content",
        }, { status: 500 })
    }
}