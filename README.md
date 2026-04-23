# ⌨️ TypeRush — Typing Speed Test

A modern typing speed test application inspired by Monkeytype, built using React, Vite, and Tailwind CSS with smooth animations.

---

## 🚀 Features

* Real-time typing test
* Clean and minimal dark UI
* Smooth animations using Framer Motion
* Fast performance with Vite
* Custom styling using Tailwind CSS

---

## 🧩 Project Structure

This repository is divided into two parts:

* **Frontend (Main Branch)** → React + Vite application
* **Backend (`backend-dev` branch)** → API server (Node.js/Express)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Eonic24/typing-speed-test.git
cd typing-speed-test
```

---

## 💻 Running the Frontend

Make sure you are on the main branch:

```bash
git checkout main
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🖥️ Running the Backend

Switch to the backend branch:

```bash
git checkout backend-dev
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

Backend will run on:

```
http://localhost:3001
```

---

## 🔗 Frontend ↔ Backend Connection

The frontend is configured to communicate with the backend using a proxy:

* `/api` → `http://localhost:3001`

This means:

* No CORS issues during development
* Seamless API integration




---

## 🛠️ Tech Stack

* React
* Vite
* Tailwind CSS
* Framer Motion
* Node.js (Backend)
* Express.js (Backend)

---

## 📌 Future Improvements

* User authentication
* Leaderboards
* Database integration
* Multiplayer typing races

---

## 📜 License

This project is open-source and available for learning and personal use.
