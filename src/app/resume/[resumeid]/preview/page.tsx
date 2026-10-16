"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getATSScoreApi } from "@/apis/ai.api";

interface ATSScore {
  overallScore: number;
  sectionScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
}

interface Resume {
  title: string;
  summary: string;

  personalInfo: {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    portfolio: string;
  };

  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];

  skills: string[];

  projects: {
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl: string;
  }[];

  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  certifications: string[];
}

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<Resume | null>(null);

  const [loading, setLoading] = useState(true);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [atsError, setAtsError] = useState("");

  const { resumeid: resumeId } = useParams();
  const router = useRouter();

  const handleDownload = () => {
    window.print();
  };

  const getResumeText = (currentResume: Resume) =>
    [
      currentResume.personalInfo?.fullname,
      currentResume.personalInfo?.email,
      currentResume.personalInfo?.mobile,
      currentResume.personalInfo?.location,
      currentResume.personalInfo?.github,
      currentResume.personalInfo?.portfolio,
      "Professional Summary",
      currentResume.summary,
      "Skills",
      ...(currentResume.skills || []),
      "Work Experience",
      ...(currentResume.workExperience || []).map(
        (experience) =>
          `${experience.position} at ${experience.company} ${experience.startDate} - ${experience.endDate} ${experience.description}`
      ),
      "Projects",
      ...(currentResume.projects || []).map(
        (project) =>
          `${project.title} ${project.description} ${(project.techStack || []).join(" ")}`
      ),
      "Education",
      ...(currentResume.education || []).map(
        (education) =>
          `${education.institute} ${education.degree} ${education.startDate} - ${education.endDate}`
      ),
      "Certifications",
      ...(currentResume.certifications || []),
    ]
      .filter(Boolean)
      .join("\n");

  const handleATSScore = async () => {
    if (!resume) return;

    setAtsLoading(true);
    setAtsError("");
    try {
      const response = await getATSScoreApi({
        resumeText: getResumeText(resume),
      });
      setAtsScore(response.data.atsScore as ATSScore);
    } catch (error) {
      console.error("Failed to generate ATS score:", error);
      setAtsError("Unable to generate the ATS score. Please try again.");
    } finally {
      setAtsLoading(false);
    }
  };

  const fetchResume = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);

      console.log("main resume in data", data);

      setResume(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Resume...
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Actions */}

          <div className="resume-actions lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border sticky top-6">
              <h2 className="font-bold text-xl mb-6">Resume Actions</h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleATSScore}
                  disabled={atsLoading}
                  className="w-full flex items-center gap-3 bg-violet-600 text-white px-4 py-3 rounded-xl disabled:opacity-60"
                >
                  <Sparkles size={18} />
                  {atsLoading ? "Analyzing..." : "ATS Score"}
                </button>

                {atsError && (
                  <p className="text-sm text-red-600">{atsError}</p>
                )}

                {atsScore && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-slate-500">ATS Score</p>
                      <p className="text-4xl font-bold text-violet-600">
                        {atsScore.overallScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Strengths</p>
                      <ul className="list-disc pl-5 text-sm text-slate-600">
                        {atsScore.strengths.map((strength) => (
                          <li key={strength}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Suggestions</p>
                      <ul className="list-disc pl-5 text-sm text-slate-600">
                        {atsScore.suggestions.map((suggestion) => (
                          <li key={suggestion}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 border px-4 py-3 rounded-xl hover:bg-slate-50"
                >
                  <Download size={18} />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/resume/${resumeId}`)}
                  className="w-full flex items-center gap-3 border px-4 py-3 rounded-xl hover:bg-slate-50"
                >
                  <Eye size={18} />
                  Edit Resume
                </button>
              </div>
            </div>
          </div>

          {/* Resume */}

          <div className="resume-content lg:col-span-3">
            <div
              id="resume-preview"
              className="bg-white shadow-lg rounded-lg p-10"
            >
              {/* Header */}

              <div className="border-b pb-6">
                <h1 className="text-4xl font-bold">
                  {resume.personalInfo?.fullname}
                </h1>

                <div className="mt-3 text-gray-600 text-sm flex flex-wrap gap-4">
                  <span>{resume.personalInfo?.email}</span>

                  <span>{resume.personalInfo?.mobile}</span>

                  <span>{resume.personalInfo?.location}</span>
                </div>

                <div className="mt-2 flex gap-4 text-sm">
                  <span>{resume.personalInfo?.github}</span>

                  <span>{resume.personalInfo?.portfolio}</span>
                </div>
              </div>

              {/* Summary */}

              {resume.summary && (
                <section className="mt-8">
                  <h2 className="font-bold text-xl mb-3">
                    Professional Summary
                  </h2>

                  <p className="text-gray-700 leading-7">{resume.summary}</p>
                </section>
              )}

              {/* Skills */}

              <section className="mt-8">
                <h2 className="font-bold text-xl mb-3">Skills</h2>

                <div className="flex flex-wrap gap-2">
                  {resume.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 px-3 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Experience */}

              <section className="mt-8">
                <h2 className="font-bold text-xl mb-4">Work Experience</h2>

                {resume.workExperience?.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold">{exp.position}</h3>

                    <p className="text-gray-500 text-sm">{exp.company}</p>

                    <p className="text-sm text-gray-500">
                      {exp.startDate}
                      {" - "}
                      {exp.endDate}
                    </p>

                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </section>

              {/* Projects */}

              <section className="mt-8">
                <h2 className="font-bold text-xl mb-4">Projects</h2>

                {resume.projects?.map((project, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold">{project.title}</h3>

                    <p className="mt-2 text-gray-700">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="bg-violet-100 text-violet-700 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* Education */}

              <section className="mt-8">
                <h2 className="font-bold text-xl mb-4">Education</h2>

                {resume.education?.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold">{edu.degree}</h3>

                    <p className="text-gray-600">{edu.institute}</p>

                    <p className="text-sm text-gray-500">
                      {edu.startDate}
                      {" - "}
                      {edu.endDate}
                    </p>
                  </div>
                ))}
              </section>

              {/* Certifications */}

              {resume.certifications?.length > 0 && (
                <section className="mt-8">
                  <h2 className="font-bold text-xl mb-4">Certifications</h2>

                  <ul className="list-disc pl-5">
                    {resume.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}