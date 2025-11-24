# Quiz App

A simple full-stack Quiz application that allows users to take quizzes, view results, and interact with a clean UI.
This project contains both backend API and frontend client.

---

## Project Structure

```
Quiz/
├── backend/        # Express / Node.js backend API
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── public
└── frontend/       # Frontend (React / Vite or CRA)
    ├── public
    └──src/
        ├── assets
        ├── components
        ├── contexts
        ├── pages
        ├── routes
        └── utils
```

---

## 🛠 Technologies Used

### **Backend**

- Node.js
- Express.js
- MongoDB / Mongoose (if used)
- JWT Authentication (optional)

### **Frontend**

- React.js
- Context API
- Axios / Fetch

---

## 🚀 Installation & Setup

### **Backend Setup**

```bash
cd backend
npm install
npm start
```

### **Frontend Setup**

```bash
cd ..
npm install
npm run dev
```

---

## ✨ Features

- 📌 Create & manage quizzes
- 📝 Take quizzes and show results
- 🔐 Authentication
- 🎨 Responsive UI

---

## API Folder Overview

| Folder        | Description                  |
| ------------- | ---------------------------- |
| `controllers` | Handles request logic        |
| `models`      | Database schema models       |
| `routes`      | API endpoints                |
| `middleware`  | Auth / validation            |
| `config`      | Database / environment setup |

---

## Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `npm start`     | Start backend server    |
| `npm run dev`   | Run frontend dev server |
| `npm run build` | Build frontend          |

---

## 📜 License

This project is free to use for learning or personal development.