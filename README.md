# FileHub

FileHub is a simple TypeScript full-stack project for secure file upload and personal file management.

## What the project does

- Users can sign up and log in.
- Authenticated users can upload files.
- Users can view only their own files.
- Users can download or delete their own files.

## Tech Stack

- Backend: TypeScript, Node.js, Express, MongoDB, Mongoose
- Frontend: HTML, CSS, TypeScript
- Authentication: JWT
- File upload: Multer

## Project Structure

```text
FileHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── uploads/
├── frontend/
│   ├── public/
│   └── src/
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
└── ErDiagram.md
```

## How the code matches your diagrams

- `AuthController` and `FileController` match the controller layer in the class diagram.
- `AuthService` and `FileService` match the business logic layer in the class diagram.
- `UserRepository` and `FileRepository` match the repository layer in the class diagram.
- `User` and `File` mongoose models match the ER diagram entities.
- The API routes follow the sequence diagram flows for signup, login, upload, list, download, and delete.

## Setup

### Backend

1. Open the `backend` folder.
2. Install packages with `npm install`.
3. Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/filehub
JWT_SECRET=your-secret-key
FRONTEND_ORIGIN=http://localhost:5000
```

4. Start the backend with `npm run dev`.

### Frontend

1. Open the `frontend` folder.
2. Install packages with `npm install`.
3. Build the frontend TypeScript with `npm run build`.

The backend serves the frontend files from `frontend/public`, so the frontend calls the API using relative paths.

## Notes for explanation

- Controllers receive requests and return responses.
- Services contain the main logic and rules.
- Repositories are the only layer that talks to MongoDB.
- Middleware checks JWT tokens before protected routes run.
- Each file record stores the owner user ID, which is how the app prevents cross-user access.
