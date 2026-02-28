# 🚀 DevSync

DevSync is a high-performance real-time collaborative coding platform that enables multiple developers to work together inside secure shared rooms. It provides synchronized multi-file editing, live communication, AI-powered assistance, and integrated code execution — all within a seamless web-based environment.

---

## 🌟 Overview

DevSync allows users to create or join collaboration rooms using a unique Room ID. Once connected, participants can edit files simultaneously, see live cursor movements, communicate through built-in chat, execute code instantly, and even draw collaboratively.

The platform is designed to simulate a lightweight cloud IDE experience with real-time synchronization powered by WebSockets.

---

## ✨ Core Features

### ⚡ Real-Time Collaboration
- Multi-user live synchronized code editing
- Real-time cursor tracking and selection visibility
- Instant updates across all connected clients

### 📁 File Management System
- Create, rename, delete files and folders
- Multi-file editing support
- Download full project as ZIP

### 🧠 AI Copilot Integration
- AI-powered code generation assistance
- Insert, replace, or copy generated snippets
- Language-aware suggestions

### 🚀 Built-in Code Execution
- Execute code directly inside the editor
- Supports multiple programming languages
- Fast remote execution via API integration

### 💬 Communication Tools
- Real-time group chat
- User join/leave notifications
- Online/offline presence indicators

### 🎨 Personalization
- Multiple editor themes
- Custom font size and font family options
- Syntax highlighting with auto language detection

### 🖊 Live Editing Indicators
- Tooltip showing active editors
- Real-time text selection visibility

### 🎨 Collaborative Drawing Board
- Integrated shared drawing canvas
- Real-time sketching with synchronization

---

## 🔐 Role-Based Access Control (Enhanced Feature)

DevSync introduces a room-level permission system:

- 👑 First user becomes Room Admin
- Admin can manage file operations
- Admin can remove disruptive users
- Controlled editing permissions

---

## 🏗 Tech Stack

### Frontend
- React
- TypeScript
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Socket.io (WebSocket communication)

### DevOps & Deployment
- Git & GitHub
- Docker
- Vercel (Frontend Hosting)

---

## ⚙️ Installation Guide

### 🖥 Method 1: Manual Setup

1. Fork this repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/devsync.git
```

3. Setup Backend:

```bash
cd server
npm install
```

Create `.env` file inside `server`:

```
PORT=3000
```

Start backend:

```bash
npm run dev
```

4. Setup Frontend:

Open new terminal:

```bash
cd client
npm install
```

Create `.env` file inside `client`:

```
VITE_BACKEND_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

5. Open browser:

```
http://localhost:5173/
```

---

### 🐳 Method 2: Docker Setup

Pull images:

```bash
docker pull yourdockerhub/devsync-server:latest
docker pull yourdockerhub/devsync-client:latest
```

Run containers:

```bash
docker run -d -p 3000:3000 --name devsync-server yourdockerhub/devsync-server
docker run -d -p 5173:5173 --name devsync-client yourdockerhub/devsync-client
```

Access:

```
http://localhost:5173/
```

---

## 🚀 Future Improvements

- Persistent database storage for rooms
- Version history tracking
- Private messaging
- Screen sharing integration
- OAuth authentication (Google/GitHub login)

---

## 🌐 Live Demo

Coming Soon...

---

## 📚 How It Works (Technical Insight)

DevSync uses Socket.io to establish WebSocket connections between the server and all connected clients. When a user edits code:

1. Change event is captured in the editor.
2. Event is emitted to the server.
3. Server broadcasts update to other clients in the same room.
4. All clients update their editor state instantly.

Room management is handled through Socket.io namespaces and room identifiers.

---

