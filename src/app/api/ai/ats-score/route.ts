import { NextRequest, NextResponse } from "next/server";
import { ATSScoreBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: ATSScoreBody = await req.json();
        const { resumeText } = body;

        if (!resumeText) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

        let prompt = `You are an expert ATS (Applicant Tracking System) analyst and professional resume reviewer.

Analyze the resume text below and evaluate how ATS friendly it is. No job description is provided, so judge the resume on general ATS best practices and overall quality.

RESUME TEXT:
${resumeText}

SCORING RUBRIC (total 100):
- Contact Information (10): name, email, phone, and location or LinkedIn/portfolio are present and clearly written.
- Professional Summary (10): present, concise, and includes relevant keywords.
- Skills (20): clear skills section with relevant, industry-standard keywords and technologies.
- Work Experience (25): action verbs, clear responsibilities, relevant keywords, and quantified achievements where possible.
- Projects (10): clear descriptions with tech stack and outcomes.
- Education (10): degree, institution, and dates present.
- Formatting and Readability (15): standard section headings, consistent structure, bullet points, no long paragraphs, no odd characters, and reasonable length.

OUTPUT RULES:
- Output ONLY a valid JSON object. No markdown, no code fences, no preamble, no explanation, and no text before or after the JSON.
- Use double quotes for all keys and string values. Do not add trailing commas.
- Use exactly this structure:

{
  "overallScore": <integer 0-100>,
  "sectionScores": {
    "contactInfo": <integer 0-10>,
    "summary": <integer 0-10>,
    "skills": <integer 0-20>,
    "experience": <integer 0-25>,
    "projects": <integer 0-10>,
    "education": <integer 0-10>,
    "formatting": <integer 0-15>
  },
  "strengths": [<2 to 4 short strings>],
  "weaknesses": [<2 to 5 short strings>],
  "missingKeywords": [<up to 8 relevant industry keywords or skills that are missing>],
  "suggestions": [<3 to 6 specific, actionable improvement tips>]
}

SCORING RULES:
- overallScore MUST equal the sum of all sectionScores.
- Be strict and realistic. Most resumes should score between 55 and 85. Give above 90 only to an excellent resume.
- If a section is missing from the resume, give it 0 and mention it in weaknesses.
- Base every score only on the resume text provided. Do not assume or invent information that is not in the text.
- Keep every string under 25 words, specific to this resume rather than generic advice.
- missingKeywords must be relevant to the role and field the resume appears to target, and must not already appear in the resume.
- Do not use first-person pronouns in any string.
`;


        const result = await generateAiContent(prompt);

        const AtsScore = result;

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "ATS score generated successfully",
            data: { AtsScore },
        }, { status: 201 })


    } catch (error) {
        console.log("error in ATS score api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate ATS score",
        }, { status: 500 })
    }
}