# 🎧 RosettaSub WIP

A web app for AI-powered audio playback, subtitle translation, and transcription using `.vtt` subtitle files.

---

## 🚀 Features

- ✅ Play audio files with synchronized `.vtt` subtitles
- 🌍 Translate subtitles between languages using AI (ex. Chinese → English)
- 🧠 Automatically generate subtitles from audio using AI transcription
- 💾 Save subtitle translations and transcriptions as `.vtt` files
- 🔧 Dockerized for easy setup and deployment

---

## 📸 Demo

> _Add a link or screenshot here once ready!_

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

## ⚙️ Running Locally

### 1. Clone the repo

https://github.com/brugbug/RosettaSub.git


# To start up the docker containers
docker-compose up -d
# To rebuild from scratch
docker-compose down --volumes

docker-compose up -d --build
