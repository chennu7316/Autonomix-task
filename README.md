# InsightBoard AI - Smart Meeting Dashboard

Transform meeting transcripts into actionable insights using AI-powered analysis and intelligent action item generation.

## 🎯 Overview

InsightBoard AI is a comprehensive productivity SaaS application that automatically analyzes meeting transcripts and generates actionable insights using Google Gemini AI. It provides a smart dashboard for tracking progress, managing action items, and visualizing productivity metrics.

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - PostgreSQL ORM
- **JWT** - Authentication
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database (running in container on VM)

### AI Integration
- **Google Gemini AI** - For intelligent action item extraction and analysis

### Infrastructure
- **Docker** - Containerization
- **VM Deployment** - Hosted on virtual machine

## 🚀 Features

- **AI-Powered Analysis**: Automatically generate action items from meeting transcripts using Google Gemini AI
- **Smart Dashboard**: Real-time statistics and progress visualization
- **Action Item Management**: Track, assign, and monitor action items with status updates
- **Progress Tracking**: Visual charts and analytics for productivity insights
- **Modern UI**: Clean, responsive interface with Tailwind CSS

## ✅ Completed Features

### Level 1 — Core Features (Required) ✅
- All core functionality implemented

### Level 2 — Enhanced Features ✅  
- All enhanced features implemented

### Level 3 — Advanced Features (Bonus) ✅
1. **Cloud Deployment** - Azure VM with Docker containers
2. **Authentication** - JWT-based secure authentication

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git
- Google Gemini AI API key

## 🛠️ Local Development Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd task-1-explain
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy the .env file content (will be shared separately)
# Paste the environment variables

# Start the backend server
npm run dev
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
# Copy the .env.local file content (will be shared separately)
# Paste the environment variables

# Start the frontend development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=insightboard
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:5000
```


## 🌐 Azure VM Deployment

### Infrastructure Setup
- **Azure Virtual Machine** with Docker installed
- **Frontend Container** - Next.js application
- **Backend Container** - Node.js API server
- **Database Container** - PostgreSQL database
- **Public IP Access** - All services accessible via public IP

### Deployment Process
1. **Create Azure VM** with Docker support
2. **Install Docker** on the VM
3. **Deploy containers** for frontend, backend, and database
4. **Configure networking** for public IP access
5. **Set up environment variables** for production

### Container Architecture
```
Azure VM
├── Frontend Container (Port 3000)
├── Backend Container (Port 5000)
├── Database Container (Port 5432)
└── Public IP Access
```

### Access Points
- **Frontend**: `http://your-vm-public-ip:3000`
- **Backend API**: `http://your-vm-public-ip:5000/api`
- **Database**: `your-vm-public-ip:5432`

## 📁 Project Structure

```
task-1-explain/
├── backend/
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication & validation
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── config/         # Database configuration
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
├── frontend/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── utils/         # Utility functions
│   ├── next.config.js # Next.js configuration
│   └── package.json   # Frontend dependencies
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Transcripts
- `GET /api/transcripts` - Get all transcripts
- `POST /api/transcripts` - Upload new transcript
- `GET /api/transcripts/:id` - Get specific transcript

### Action Items
- `GET /api/action-items` - Get all action items
- `PUT /api/action-items/:id` - Update action item
- `GET /api/action-items/stats/overview` - Get statistics

### Dashboard
- `GET /api/dashboard/overdue-items` - Get overdue items
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/action-items-by-status` - Get status statistics

## 🤖 AI Integration

The application uses **Google Gemini AI** to:
- Analyze meeting transcripts
- Extract key action items
- Generate intelligent insights
- Provide contextual recommendations

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Database Schema

### Users
- id, username, email, password, role, created_at, updated_at

### Transcripts
- id, user_id, title, content, status, created_at, updated_at

### Action Items
- id, transcript_id, title, description, priority, status, assigned_to, due_date, created_at, updated_at

## 🚀 Quick Start

1. **Clone the repository**
2. **Set up PostgreSQL database**
3. **Configure environment variables**
4. **Install dependencies** (`npm install` in both directories)
5. **Start backend** (`npm run dev` in backend directory)
6. **Start frontend** (`npm run dev` in frontend directory)
7. **Access the application** at `http://localhost:3000`

## 📝 License
