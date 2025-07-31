# SchoolSync

SchoolSync is a full-stack web application designed to streamline school management, communication, and collaboration between administrators, teachers, and students. It features robust user roles, real-time messaging, course and quiz management, and a modern, responsive UI.

## Features

### For Admins
- Manage teachers, students, classes, and subjects
- Dashboard with statistics and overviews
- Profile management

### For Teachers
- Manage courses, quizzes, and classes
- Grade submissions and interact with students
- Real-time chat with students
- Detailed course and quiz analytics

### For Students
- Enroll in courses and take quizzes
- View grades and feedback
- Real-time chat with teachers
- Profile and answered quizzes overview

### General
- Role-based authentication and authorization
- Real-time messaging via Socket.IO
- File uploads (e.g., assignments, resources)
- Responsive, modern UI built with React and Tailwind CSS

## Tech Stack

- **Frontend:** React, Redux, React Router, Tailwind CSS, Vite, Axios, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB (via Mongoose), Socket.IO, JWT Auth, Multer, Winston
- **Dev Tools:** ESLint, Prettier, Nodemon

## Project Structure

```
.
├── client/         # Frontend (React)
│   ├── src/
│   │   ├── pages/          # Main pages for each user role
│   │   ├── components/     # Reusable and role-specific components
│   │   ├── redux/          # State management (actions, reducers, store)
│   │   ├── services/       # API and socket services
│   │   └── utils/          # Utility functions
│   └── public/
├── server/         # Backend (Node.js/Express)
│   ├── controllers/ # Business logic for each resource
│   ├── routes/      # API endpoints
│   ├── models/      # Mongoose models
│   ├── middleware/  # Auth and other middleware
│   ├── config/      # DB and environment config
│   └── uploads/     # Uploaded files
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Abdelouahed06/schoolsync.git
cd schoolsync
```

#### 2. Setup the backend

```bash
cd server
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm run dev
```

#### 3. Setup the frontend

```bash
cd ../client
npm install
npm run dev
```

#### 4. Access the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Environment Variables

Create a `.env` file in the `server/` directory with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Scripts

### Backend

- `npm run dev` — Start server with nodemon
- `npm start` — Start server

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Contributing

Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or improvements.

## License

This project is licensed under the ISC License.
