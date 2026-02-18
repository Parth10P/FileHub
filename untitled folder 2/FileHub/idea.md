# 📁 FileHub

**A Secure Web-Based File Upload and Sharing System**

---

## Problem Statement

Managing files across devices and sharing them with others is still a hassle for many users. People often rely on email attachments, USB drives, or scattered cloud services. This leads to:

- **No centralized storage** — Files are spread across devices with no single point of access.
- **Security concerns** — Sharing files via email or public links risks unauthorized access.
- **No file management** — Users lack a simple interface to organize, view, and delete their uploaded files.
- **Size and format limitations** — Many platforms restrict file types or impose hidden limits.

FileHub is built to fix this.

---

## What is FileHub?

FileHub is a full-stack web application that allows users to securely upload, store, view, download, and delete their files through a clean and intuitive interface.

There is one type of user:

### 👤 User
- Register and log in to their personal account.
- Upload files to the server with a single click.
- View a list of all their uploaded files with details.
- Download any previously uploaded file.
- Delete files they no longer need.
- All files are tied to the authenticated user — no one else can access them.

---

## Core Features

### 1. Secure Authentication
Users sign up and log in with email and password. Passwords are hashed using bcrypt. Routes are protected by JWT-based authentication middleware.

### 2. File Upload
Users can upload files through the frontend. The backend stores the file on the server and saves the file metadata (name, path, size, upload date) in the database.

### 3. File Listing
Users can view all their uploaded files in a clean dashboard. Each file entry shows the file name, upload date, and available actions (download / delete).

### 4. File Download
Users can download any of their files at any time. The backend streams the file from the server storage to the client.

### 5. File Deletion
Users can permanently delete files. The backend removes both the physical file from the server and the record from the database.

### 6. User-Scoped Access
Every file is tied to a specific user via a foreign key. Users can only access their own files — no cross-user access is possible.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Frontend | HTML, CSS, JavaScript |
| Auth | JWT (JSON Web Tokens) |
| File Handling | Multer |

---

## Architecture

The backend follows a **Controller → Service → Repository** pattern:

- **Controllers** handle incoming HTTP requests and send responses.
- **Services** contain the business logic — validating uploads, checking ownership, enforcing access rules.
- **Repositories** talk to the database through Mongoose. No raw queries leak into the business layer.

The codebase uses **OOP principles** in JavaScript:
- **Encapsulation** — Database logic is hidden behind Repository classes.
- **Abstraction** — Clear separation between routes, controllers, services, and data access.
- **Single Responsibility** — Each module handles one concern only.

---

## Project Structure

```
FileHub/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access via Mongoose
│   │   ├── models/          # Mongoose schemas & models
│   │   ├── middlewares/     # Auth guard
│   │   ├── routes/          # Express route definitions
│   │   ├── uploads/         # Uploaded file storage
│   │   ├── utils/           # Helpers (token generation, etc.)
│   │   └── app.js           # Express app setup
│   └── package.json
├── frontend/                # HTML/CSS/JS client
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
└── ErDiagram.md
```
