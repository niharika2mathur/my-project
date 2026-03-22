"use client";

import { useState } from "react";

const BRANCHES = [
  "Computer Science", "Information Technology", "Electronics & Communication",
  "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
  "Data Science", "Artificial Intelligence", "Business Administration", "Other"
];

const ROLES = [
  "Software Development", "Data Science / ML", "Web Development",
  "UI/UX Design", "Cybersecurity", "Cloud / DevOps", "Product Management",
  "Business Analyst", "Finance / Accounting", "Marketing", "Research", "Other"
];

interface Result {
  gaps: { skill: string; why: string; resource: string }[];
  summary: string;
  coverLetter: string;
  fitScore: number;
  fitReason: string;
}

export default function InternshipAgent() {
  const [form, setForm] = useState({
    name: "", branch: "Computer Science", cgpa: "", year: "2nd Year",
    skills: "", projects: "", targetRole: "Software Development", targetCompany: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("gaps");
  const [copied, setCopied] = useState("");

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    if (!form.name || !form.skills || !form.targetRole) {
      setError("Please fill in your name, skills and target role at minimum.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    const targetInfo = form.targetCompany ? " at " + form.targetCompany : "";
    const prompt = "You are an expert career counsellor helping a university student land internships in India.\n\n" +
      "Student Profile:\n" +
      "- Name: " + form.name + "\n" +
      "- Branch: " + form.branch + "\n" +
      "- Year: " + form.year + "\n" +
      "- CGPA: " + (form.cgpa || "Not provided") + "\n" +
      "- Current Skills: " + form.skills + "\n" +
      "- Projects: " + (form.projects || "Not mentioned") + "\n" +
      "- Target Role: " + form.targetRole + "\n" +
      "- Target Company: " + (form.targetCompany || "Any good company") + "\n\n" +
      "Respond ONLY with a valid JSON object, no markdown, no explanation:\n\n" +
      '{\n' +
      '  "fitScore": <number 1-100>,\n' +
      '  "fitReason": "<one sentence explaining the score honestly>",\n' +
      '  "gaps": [\n' +
      '    {\n' +
      '      "skill": "<missing skill for ' + form.targetRole + '>",\n' +
      '      "why": "<one sentence why this matters>",\n' +
      '      "resource": "<specific free resource e.g. freeCodeCamp, Coursera, YouTube channel>"\n' +
      '    }\n' +
      '  ],\n' +
      '  "summary": "<4-line resume summary in first person, specific to their skills, professional tone>",\n' +
      '  "coverLetter": "<Complete cover letter for ' + form.name + ' applying for ' + form.targetRole + targetInfo + '. Address to The Hiring Manager. 250-300 words.>"\n' +
      '}';

    try {
      const response = await fetch("/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
        })
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const data = await response.json();
      const text = (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: Result = JSON.parse(clean);
      setResult(parsed);
      setActiveTab("gaps");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Check terminal logs for details.");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  const tabs = [
    { id: "gaps", label: "Skill Gaps", emoji: "🎯" },
    { id: "summary", label: "Resume Summary", emoji: "📄" },
    { id: "cover", label: "Cover Letter", emoji: "✉️" },
  ];

  const scoreColor = result
    ? result.fitScore >= 70 ? "#16a34a" : result.fitScore >= 40 ? "#d97706" : "#dc2626"
    : "#6366f1";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🤖 AI Agent
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Internship Application Agent</h1>
          <p className="text-gray-500 mt-2 text-sm">Fill your profile once — get skill gaps, resume summary and a ready-to-send cover letter.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your Profile</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                placeholder="e.g. Niharika Sharma"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <select value={form.year} onChange={e => update("year", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                {["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Branch</label>
              <select value={form.branch} onChange={e => update("branch", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CGPA</label>
              <input type="text" value={form.cgpa} onChange={e => update("cgpa", e.target.value)}
                placeholder="e.g. 8.2"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Current Skills * <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input type="text" value={form.skills} onChange={e => update("skills", e.target.value)}
              placeholder="e.g. Python, React, SQL, Machine Learning basics, Git"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Projects <span className="text-gray-400 font-normal">(brief description)</span></label>
            <textarea value={form.projects} onChange={e => update("projects", e.target.value)}
              placeholder="e.g. Built a movie recommendation system using collaborative filtering."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Role *</label>
              <select value={form.targetRole} onChange={e => update("targetRole", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Company <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={form.targetCompany} onChange={e => update("targetCompany", e.target.value)}
                placeholder="e.g. Google, Infosys, Startup"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                AI Agent is working...
              </>
            ) : "🚀 Generate My Internship Kit"}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
              <div className="flex-shrink-0 relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                    strokeDasharray={result.fitScore + " 100"} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: scoreColor }}>{result.fitScore}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Readiness Score</p>
                <p className="text-gray-800 text-sm leading-relaxed">{result.fitReason}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={"flex-1 px-4 py-3.5 text-sm font-medium transition flex items-center justify-center gap-1.5 border-b-2 " +
                      (activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
                    <span>{tab.emoji}</span>{tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "gaps" && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 mb-4">Skills you need for a {form.targetRole} internship that you don&apos;t have yet.</p>
                    {result.gaps.map((gap, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{gap.skill}</p>
                            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{gap.why}</p>
                            <div className="mt-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">📚 {gap.resource}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "summary" && (
                  <div>
                    <p className="text-xs text-gray-400 mb-4">Copy this directly into the top of your resume under your name.</p>
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{result.summary}</p>
                    </div>
                    <button onClick={() => copyText(result.summary, "summary")}
                      className="mt-3 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      {copied === "summary" ? "✅ Copied!" : "📋 Copy to clipboard"}
                    </button>
                  </div>
                )}

                {activeTab === "cover" && (
                  <div>
                    <p className="text-xs text-gray-400 mb-4">Ready to send. Paste into your email, review once, and hit send.</p>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{result.coverLetter}</p>
                    </div>
                    <button onClick={() => copyText(result.coverLetter, "cover")}
                      className="mt-3 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      {copied === "cover" ? "✅ Copied!" : "📋 Copy cover letter"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Atlas Skilltech University · AI Internship Agent · Powered by Gemini
        </p>
      </div>
    </div>
  );
}