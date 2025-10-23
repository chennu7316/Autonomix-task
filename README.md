# InsightBoard AI - Smart Meeting Dashboard

A comprehensive productivity SaaS application that transforms meeting transcripts into actionable insights using AI-powered action item generation and progress tracking.

## 🚀 Features

- **AI-Powered Analysis**: Automatically generate action items from meeting transcripts using OpenAI
- **Smart Dashboard**: Real-time statistics and progress visualization
- **Action Item Management**: Track, assign, and monitor action items with status updates
- **Progress Tracking**: Visual charts and analytics for productivity insights
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and Framer Motion
- **Backend**: Node.js with Express.js, MVC architecture (Services, Controllers, Routes)
- **Database**: PostgreSQL with Sequelize ORM
- **AI Integration**: OpenAI GPT-3.5-turbo for intelligent action item extraction
- **API**: RESTful API with comprehensive endpoints and proper validation

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 12+
- OpenAI API key

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd insightboard-ai
   npm run install:all
   ```

2. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb insightboard_dev
   ```

3. **Set up environment variables:**
   ```bash
   # Copy environment template
   cp backend/env.example backend/.env
   
   # Edit backend/.env and configure your settings
   DB_PASSWORD=your_postgres_password
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Initialize database:**
   ```bash
   cd backend
   npm run migrate
   npm run seed  # Optional: add sample data
   ```

5. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=insightboard_dev
DB_USER=postgres
DB_PASSWORD=your_password

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Logging
LOG_LEVEL=info
```

### API Endpoints

#### Transcripts
- `GET /api/transcripts` - Get all transcripts
- `POST /api/transcripts` - Create new transcript
- `GET /api/transcripts/:id` - Get specific transcript
- `PUT /api/transcripts/:id` - Update transcript
- `DELETE /api/transcripts/:id` - Delete transcript

#### Action Items
- `GET /api/action-items` - Get all action items
- `POST /api/action-items` - Create new action item
- `GET /api/action-items/:id` - Get specific action item
- `PUT /api/action-items/:id` - Update action item
- `PATCH /api/action-items/:id/status` - Update action item status
- `DELETE /api/action-items/:id` - Delete action item

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/action-items-by-status` - Get action items by status
- `GET /api/dashboard/overdue-items` - Get overdue action items

## 🎯 Usage

### 1. Upload Meeting Transcripts
- Navigate to the "Transcripts" tab
- Fill in meeting details (title, date, participants)
- Paste your meeting transcript
- Click "Upload & Generate Action Items"
- AI will automatically analyze and create actionable items

### 2. Manage Action Items
- View all action items in the "Action Items" tab
- Filter by status (pending, in_progress, completed)
- Update status and assignees
- Create new action items manually

### 3. Track Progress
- Monitor completion rates on the dashboard
- View overdue items and take action
- Analyze productivity trends with charts

## 🛠️ Development

### Project Structure
```
insightboard-ai/
├── backend/
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic (AI integration)
│   ├── database/         # Database initialization
│   └── server.js         # Express server
├── frontend/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── public/           # Static assets
└── package.json          # Root package.json
```

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend  
npm run dev:frontend

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure database path
3. Set up OpenAI API key
4. Configure CORS for production domain

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤖 AI Integration

The application uses OpenAI's GPT-3.5-turbo model to:
- Analyze meeting transcripts
- Extract actionable items
- Assign priorities and assignees
- Generate due dates when mentioned

### AI Features
- **Smart Extraction**: Identifies action items from natural language
- **Priority Assignment**: Automatically assigns high/medium/low priority
- **Assignee Detection**: Extracts mentioned names as assignees
- **Due Date Recognition**: Identifies and formats mentioned dates

## 📊 Database Schema

### Transcripts Table
- `id` (Primary Key)
- `title` (Meeting title)
- `content` (Transcript text)
- `meeting_date` (Date of meeting)
- `participants` (Attendee names)
- `created_at`, `updated_at` (Timestamps)

### Action Items Table
- `id` (Primary Key)
- `transcript_id` (Foreign Key)
- `title` (Action item title)
- `description` (Detailed description)
- `assignee` (Responsible person)
- `due_date` (Deadline)
- `status` (pending/in_progress/completed/cancelled)
- `priority` (high/medium/low)
- `created_at`, `updated_at` (Timestamps)

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Sanitizes user inputs
- **Error Handling**: Secure error responses
- **Helmet.js**: Security headers

## 📈 Performance

- **SQLite Database**: Fast, lightweight data storage
- **Optimized Queries**: Efficient database operations
- **Caching**: React state management for performance
- **Lazy Loading**: Component-based code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for productivity and AI-powered insights**
