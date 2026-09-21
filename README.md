# 🍴 Punjabi-Tadka

Punjabi-Tadka is a full-stack food ordering web application designed to provide a simple and user-friendly experience for customers to browse food items, add items to their cart, and place orders.

The project also includes an **Admin Panel** where administrators can view and manage customer orders.

---

## 🚀 Features

### 👤 User Features
- Browse available food items
- View food details
- Add items to cart
- Update cart quantity
- Place food orders
- View order information
- Responsive user interface

### 👨‍💼 Admin Features
- Admin dashboard
- View customer orders
- View order details
- Manage incoming orders
- Update order status
- Monitor food orders

### ⚡ Application Features
- Modern and responsive UI
- Frontend and backend integration
- Database integration
- REST API based communication
- Environment variable support
- Deployment-ready project structure

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Python
- REST API

### Database
- Database integration for storing users, food items and orders

### Tools & Deployment
- Git
- GitHub
- VS Code
- Vercel
- Render

---

## 📁 Project Structure

```text
Punjabi-Tadka/
│
├── assets/
│   └── Images and project assets
│
├── backend/
│   └── Backend API and server-side code
│
├── src/
│   └── Frontend source code
│
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── render.yaml
├── test_admin_smoke.py
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── README.md



## 🛠️ Development Commands

1. Frontend Install: `npm install`
2. Frontend Run: `npm run dev`
3. Backend Directory: `cd backend`
4. Backend Dependencies: `pip install -r requirements.txt`
5. Application Directory: `cd app`
6. Backend Run: `uvicorn main:app --reload --port 8000`
7. API Documentation: `http://127.0.0.1:8000/docs`
8. API Test: `curl http://127.0.0.1:8000/api/menu`
9. Database: `python -m backend.database`
