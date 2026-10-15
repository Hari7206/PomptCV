import { NextRequest, NextResponse } from "next/server";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { generateAiContent } from "@/lib/nvida";



export async function POST(req: NextRequest) {
    try {

        const body: GenerateSummaryBody = await req.json();
        const { experienceLevel, jobTitle } = body;

        if (!experienceLevel || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, { status: 400 })
        }

const prompt = `You are a technical recruiter and ATS (Applicant Tracking System) specialist.

Generate a list of technical skills for the role below.

JOB TITLE: ${jobTitle}
EXPERIENCE LEVEL: ${experienceLevel}

=== ABSOLUTE OUTPUT CONTRACT ===
- Your entire response MUST be a single valid JSON array of strings.
- The FIRST character of your response MUST be "[".
- The LAST character of your response MUST be "]".
- Do NOT wrap the JSON in markdown, code fences, backticks, or triple backticks.
- Do NOT write the word "json" anywhere in the response.
- Do NOT add any explanation, preamble, heading, label, or closing remark.
- Do NOT return an object. Do NOT return a key like "skills". Return ONLY the raw array.
- Every string must use double quotes. No trailing commas. No comments.

=== CONTENT CONTRACT ===
- Return exactly 12 to 15 items.
- Each item must be a single hard/technical skill, 1 to 3 words long.
- Use exact industry-standard spelling and casing (e.g. "JavaScript", "Node.js", "PostgreSQL", "AWS", "CI/CD").
- Order items from most important to least important for this role and level.
- Tailor selection to the experience level:
  - Entry: fundamentals, core languages, basic tools.
  - Mid: frameworks, databases, testing, version control, APIs.
  - Senior: system design, cloud architecture, CI/CD, performance, scalability, observability.

=== FORBIDDEN CONTENT ===
- No soft skills (communication, teamwork, leadership, problem solving, attention to detail).
- No generic phrases (fast learner, hard worker).
- No job title repeated as a skill.
- No duplicate items.
- No skill that is not a recognized technical skill.

=== EXAMPLE OF A VALID RESPONSE ===
["JavaScript","TypeScript","React","Next.js","Redux","HTML5","CSS3","Tailwind CSS","REST APIs","Git","Jest","Webpack","CI/CD"]

Return ONLY the JSON array now.
`;

        const result = await generateAiContent(prompt);

        let skills = result;

        if(typeof skills === "string"){
            try{
                skills = JSON.parse(skills);
            } catch(error){
                console.error("error parsing skills", error);
            }
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "skills created successfully",
            data: { skills },
        }, { status: 201 })


    } catch (error) {
        console.log("error in generate skills summary api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate skills",
        }, { status: 500 })
    }
}