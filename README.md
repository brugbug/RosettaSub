# 🎧 RosettaSub WIP

A web app for AI-powered audio playback, subtitle translation, and transcription using `.vtt` subtitle files.

---

## ⚙️ Setting Up the Project Locally

### 1. Open your CLI of choice and clone the repo

git clone https://github.com/brugbug/RosettaSub.git

### 2. Download Docker Desktop

You can download it at: https://www.docker.com/products/docker-desktop/

### 3. Navigate to the RosettaSub folder

cd /path/to/your/project/RosettaSub

### 4. Build the Docker containers

docker-compose up -d

### 5. Set your Google Gemini API key at /path/to/your/project/RosettaSub/backend/.env

You can generate an API key at https://aistudio.google.com/app/apikey

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


