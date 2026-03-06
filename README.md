# NeuroNest - Personal Notes & Bookmark Manager

NeuroNest is a full-stack, AI-powered productivity application designed to help you securely manage your notes and bookmarks with intelligence.

A scalable full-stack MERN application that allows users to securely manage notes, bookmarks, and personal activity analytics. The application follows a modular MVC architecture with secure authentication and RESTful APIs for efficient data management.

---

## 🚀 Features

- Secure user authentication (Register & Login)
- Create, update, delete, and manage personal notes
- Bookmark important resources for quick access
- Activity analytics tracking
- RESTful API architecture
- Modular and scalable MVC backend structure

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other Technologies
- REST APIs
- JWT Authentication
- MVC Architecture
- JavaScript

---

## 📂 Project Structure

```
project-root
│
├── config
│   └── Database configuration
│
├── controllers
│   └── Application business logic
│
├── models
│   └── MongoDB schemas
│
├── middlewares
│   └── Authentication and request validation
│
├── routes
│   └── API route handlers
│
├── package.json
└── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/project-name.git
```

### 2. Navigate into the project directory

```
cd project-name
```

### 3. Install dependencies

```
npm install
```

### 4. Create environment variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the server

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 🔗 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Notes

```
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id
```

### Bookmarks

```
GET /api/bookmarks
POST /api/bookmarks
DELETE /api/bookmarks/:id
```

---

## 📈 Future Improvements

- Add real-time notifications
- Implement role-based access control
- Build a React frontend dashboard
- Deploy to cloud infrastructure

---

## 👨‍💻 Author

Gautam  
B.Tech Information Technology Student interested in full-stack development, backend systems, and scalable web applications.

---

## ⭐ Support

If you like this project, please give it a star on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
