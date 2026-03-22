# 🎓 Atlas AI Command Centre — AI Internship Application Agent

> An AI agent integrated into the Atlas University Command Centre that analyzes a student's profile and instantly generates a readiness score, skill gap analysis, resume summary, and personalized cover letter to help them land internships.

---

## 🚨 The Problem

Getting an internship as a university student is hard. Students don't know:
- Whether their current skills are enough for their target role
- What skills they are missing and where to learn them
- How to write a strong resume summary
- How to write a professional cover letter

This AI agent solves all four problems in seconds.

---

## 🤖 The AI Agent

The **Internship Application Agent** is powered by **Google Gemini**.

A student fills in their profile once — branch, year, CGPA, current skills, projects, and target role. The agent:

1. Calculates a **Readiness Score** (0–100) with an honest explanation
2. Identifies **Skill Gaps** — what's missing for the target role and where to learn it free
3. Generates a **Resume Summary** — 4 lines, ready to paste into a CV
4. Writes a **Cover Letter** — personalised, professional, ready to send

All of this happens in under 5 seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 Readiness Score | AI scores how ready the student is for their target role |
| 📚 Skill Gap Analysis | Missing skills with free learning resources |
| 📄 Resume Summary | 4-line professional summary tailored to the student |
| ✉️ Cover Letter | Full personalised cover letter, copy with one click |
| 🔒 Role-Based Access | Secured with JWT auth — students and admins |
| 🎨 Command Centre UI | Integrated into the Atlas sidebar like a native feature |

---

## 💻 Tech Stack

| Area | Technology |
|---|---|
| Frontend | Next.js 14 + React + TypeScript + Tailwind CSS |
| AI Agent | Google Gemini (`gemini-2.0-flash`) |
| Auth | NextAuth.js + JWT |
| Backend | FastAPI + PostgreSQL |
| Infra | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- A free Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Step 1 — Clone
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### Step 2 — Configure environment
```bash
cp .env.example .env
```

Open `.env` and set:
```
GEMINI_API_KEY=your-gemini-api-key-here
NEXTAUTH_SECRET=any-random-string-here
SECRET_KEY=any-random-string-here
```

### Step 3 — Start everything
```bash
docker compose up --build
```

Wait 3–4 minutes for all services to start.

### Step 4 — Open the app
```
http://localhost:3000
```

Login with:
- **Email**: `admin@atlasuniversity.edu.in`
- **Password**: `admin123`

### Step 5 — Use the AI Agent
Click **Internship Agent** in the sidebar or go to:
```
http://localhost:3000/internship
```

---

## 🎬 How It Works

1. Student opens the **Internship Agent** page from the sidebar
2. Fills in their profile — name, branch, year, CGPA, skills, projects, target role, and optionally target company
3. Clicks **Generate My Internship Kit**
4. Gemini AI analyzes the profile and returns:
   - A readiness score with reasoning
   - Skill gaps with free resources to fill them
   - A resume summary to copy into their CV
   - A full cover letter ready to send
5. Student copies what they need and applies

---

## 📁 Project Structure

```
my-project/
├── backend/
│   └── app/
│       ├── api/              # FastAPI routes
│       ├── models/           # Database models
│       ├── services/ai/      # Gemini AI client
│       └── core/             # Auth, config, database
│
├── frontend/
│   └── src/
│       ├── app/
│       │   └── (dashboard)/
│       │       └── internship/
│       │           └── page.tsx    # 🤖 AI Agent page
│       └── components/
│           └── layout/
│               └── Sidebar.tsx     # Navigation with Internship Agent link
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📡 Key Pages

| Route | Description |
|---|---|
| `/internship` | AI Internship Application Agent — the core feature |
| `/` | Command Centre Dashboard |
| `/admin/users` | User management |
| `/admin/audit` | Audit logs |
| `/ai/policies` | AI policy engine |
| `/ai/insights` | AI insights |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI features |
| `NEXTAUTH_SECRET` | ✅ Yes | Session secret for NextAuth.js |
| `SECRET_KEY` | ✅ Yes | JWT signing key |
| `DATABASE_URL` | Auto | Set automatically by Docker |

---

## 🛠️ Useful Commands

```bash
docker compose up --build        # Start everything
docker compose down              # Stop everything
docker compose restart frontend  # Restart frontend after file changes
docker compose logs -f backend   # View backend logs
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---|---|
| Page not loading after adding files | Run `docker compose restart frontend` |
| Login fails | Make sure `NEXTAUTH_SECRET` is set in `.env` |
| AI not generating | Check `GEMINI_API_KEY` is set correctly in `.env` |
| Port already in use | Change `FRONTEND_PORT` / `BACKEND_PORT` in `.env` |

---

## 🏗️ Built On

This project is built on the **Atlas AI Command Centre Template** by Shreyas Dole — a production-ready full-stack framework for AI-powered university applications.

Original template: [github.com/ShreyasDole/Atlas-Template](https://github.com/ShreyasDole/Atlas-Template)

---

## 👩‍💻 Built By

**Niharika** — AI Internship Application Agent
Developed as part of the Atlas AI Command Centre ecosystem
Atlas Skilltech University · 2026

---

## 📄 License

Built on Atlas AI Command Center Template — MIT License
