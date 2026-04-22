# LIMIS

<p align="center">
  <img src="limis-web/public/limis_icon.svg" alt="LIMIS Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Secure Your Digital World with Confidence</strong>
</p>

<p align="center">
  A modern, secure credential management system built with React and Node.js
</p>

<p align="center">
  <a href="https://limis-by-hanz.vercel.app">🚀 Live Demo</a>
</p>

## 🛠️ Built With

**Frontend:**

- ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
- ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

**Backend:**

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
- ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongodb&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

**Security & Encryption:**

- ![Argon2](https://img.shields.io/badge/Argon2-FF6B6B?style=flat-square&logo=security&logoColor=white)
- ![bcrypt](https://img.shields.io/badge/bcrypt-4A90E2?style=flat-square&logo=security&logoColor=white)
- ![Web Crypto API](https://img.shields.io/badge/Web_Crypto_API-FFD700?style=flat-square&logo=security&logoColor=black)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Overview](#-overview)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [⚙️ Installation](#️-installation)
  - [🔧 Environment Variables](#-environment-variables)
  - [🏃‍♂️ Running the Application](#️-running-the-application)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Security Features](#-security-features)
- [📖 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)

## ✨ Features

- 🔐 **Secure Vault Management** - End-to-end encrypted credential storage
- 🔑 **Advanced Authentication** - JWT-based auth with email verification
- 🎨 **Modern UI/UX** - Clean, responsive interface with dark/light themes
- 🛡️ **Zero-Knowledge Architecture** - Your master password never leaves your device
- 📱 **Cross-Platform** - Web-based application accessible anywhere
- 🔍 **Smart Search** - Quick credential lookup and filtering
- 📊 **Password Analytics** - Strength assessment and breach detection
- 🌐 **Secure Sharing** - Safe credential sharing between vault members
- 🔄 **Real-time Sync** - Instant updates across all your devices
- 📤 **Import/Export** - Seamless migration from other password managers

## 🎯 Overview

LIMIS is a modern, full-stack credential management system that prioritizes security and user experience. Built with cutting-edge technologies, it provides a robust solution for individuals and teams to securely store, manage, and share sensitive information.

### 🎯 Key Highlights

- **�️ Security First**: Military-grade encryption with Argon2 password hashing and AES-256 encryption
- **🚀 Modern Stack**: React 18 + TypeScript frontend with Node.js + Express backend
- **📱 Responsive Design**: Beautiful, accessible UI that works on all devices
- **⚡ High Performance**: Optimized with Vite bundling and efficient MongoDB queries
- **🔧 Developer Friendly**: Comprehensive TypeScript support and modular architecture
- **🌐 Production Ready**: Configured for deployment with Docker and cloud platforms

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **Git**

### ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hanzfernando/limis.git
   cd limis
   ```

2. **Install backend dependencies**

   ```bash
   cd limis-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../limis-web
   npm install
   ```

### 🔧 Environment Variables

Create environment configuration files in the respective directories:

#### Backend Environment (`limis-backend/.env.local`)

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/limis
NODE_ENV=development

# Server Configuration
PORT=8000
CLIENT_URL=http://localhost:5173

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Service (for verification emails)
SERVICE_ACCOUNT_EMAIL=your-email@gmail.com
SERVICE_ACCOUNT_PASSWORD=your-app-password
```

#### Frontend Environment (`limis-web/.env.local`)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

> ⚠️ **Security Note**: Never commit `.env.local` files to version control. Add them to your `.gitignore` file.

### 🏃‍♂️ Running the Application

1. **Start the backend server**

   ```bash
   cd limis-backend
   npm run server
   ```

2. **Start the frontend development server**

   ```bash
   cd limis-web
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## 🏗️ Project Structure

```
limis/
├── limis-backend/          # Node.js + Express API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route definitions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Application entry point
│   └── package.json
│
├── limis-web/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layout components
│   │   ├── pages/          # Application pages
│   │   ├── routes/         # Client-side routing
│   │   ├── service/        # API service layer
│   │   ├── state/          # Redux store and slices
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

LIMIS implements multiple layers of security to protect your sensitive data:

- **🔒 End-to-End Encryption**: All credentials are encrypted client-side before transmission
- **🛡️ Zero-Knowledge Architecture**: Master passwords are never stored or transmitted
- **🔑 Argon2 Password Hashing**: Industry-standard password hashing algorithm
- **🎫 JWT Authentication**: Secure token-based authentication with refresh tokens
- **📧 Email Verification**: Account verification to prevent unauthorized access
- **🔄 CSRF Protection**: Cross-site request forgery protection
- **🌐 CORS Configuration**: Properly configured cross-origin resource sharing
- **📊 Input Validation**: Comprehensive server-side input validation and sanitization

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| POST   | `/api/auth/signup`       | User registration  |
| POST   | `/api/auth/login`        | User login         |
| POST   | `/api/auth/logout`       | User logout        |
| GET    | `/api/auth/verify-email` | Email verification |

### User Management

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/user/profile`         | Get user profile     |
| PATCH  | `/api/user/change-password` | Change user password |

### Vault Management

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | `/api/vaults`     | Get user vaults  |
| POST   | `/api/vaults`     | Create new vault |
| GET    | `/api/vaults/:id` | Get vault by ID  |
| PUT    | `/api/vaults/:id` | Update vault     |
| DELETE | `/api/vaults/:id` | Delete vault     |

For detailed API documentation, visit `/api/docs` when running the development server.

## 🚀 Deployment

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Manual Deployment

1. **Build the frontend**

   ```bash
   cd limis-web
   npm run build
   ```

2. **Deploy backend**
   ```bash
   cd limis-backend
   npm run build
   npm start
   ```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/hanzfernando">Hanz Fernando</a>
</p>

<p align="center">
  <a href="#limis">⬆️ Back to top</a>
</p>
