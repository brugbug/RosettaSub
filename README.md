# 🎧 RosettaSub WIP

A web app for AI-powered audio playback, subtitle translation, and transcription using `.vtt` subtitle files.

---

## ⚙️ Setting Up the Project Locally

### 1. Open your CLI of choice and clone the repo

git clone https://github.com/brugbug/RosettaSub.git

### 2. Download Docker Desktop

You can download it at: https://www.docker.com/products/docker-desktop/

### 3. Navigate to the RosettaSub/backend folder and set .env file

cd /path/to/your/project/RosettaSub/backend

Needed for API keys and other secrets
You can just copy this and set the GEMINI_API_KEY (not using OpenAI yet)
```
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Database <<TBD>>
DATABASE_URL=postgresql://postgres:password@localhost:5432/subtitle_generator

# Environment
ENVIRONMENT=development
```

You can generate an API key at https://aistudio.google.com/app/apikey

### 4. Navigate to RosettaSub folder and build the Docker containers

cd ..

docker-compose up -d

### *If you ever needed to rebuild the project for whatever reason

docker-compose down --volumes
docker-compose up -d --build

---

## 🚀 Features

- ✅ Play audio files with synchronized `.vtt` subtitles
- 🌍 Translate subtitles between languages using AI (ex. Chinese → English)
- 🧠 Automatically generate subtitles from audio using AI transcription
- 💾 Save subtitle translations and transcriptions as `.vtt` files
- 🔧 Dockerized for easy setup and deployment

---

## 📸 Demo

> Add a link or screenshot here once ready! 

---

## 🛠 Tech Stack

| Area       | Technology          |
|------------|---------------------|
| Frontend   | Next.js, Tailwind CSS |
| Backend    | FastAPI (Python)     |
| AI         | OpenAI Whisper / GPT, LibreTranslate or DeepL |
| Container  | Docker               |
| Dev Tools  | GitHub, Kanban (Trello or Notion), GitHub Actions (optional)

---


