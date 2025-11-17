# GrieveEase

A complaint management system for educational institutions with AI-powered assistance.

**Team:** Team Golmaal

---

## Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (v6 or higher) - Running locally or cloud instance
- **Ollama** (for AI features) - [Download here](https://ollama.ai)

### Setting up Ollama

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull a model (recommended):
   ```bash
   ollama pull llama2
   ```
   or
   ```bash
   ollama pull mistral
   ```
3. Start Ollama server:
   ```bash
   ollama serve
   ```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shivambhandary75/grive_ease.git
cd grive_ease
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

---

## Configuration

### Server Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/grievease

# JWT Configuration
JWT_SECRET=GrieveEase_JWT_Secret_Key_2024_ProductionReady_$ecure#Token@12345

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
OLLAMA_API_KEY=your_ollama_api_key_here

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Client Configuration

The client connects to `http://localhost:8080` by default. If you need to change this, update the API URLs in `client/src/utils/api.js`.

---

## Running the Application

### Start MongoDB

Ensure MongoDB is running:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Start Ollama (for AI features)

```bash
ollama serve
```

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:8080`

### Start the Frontend Client

Open a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## Project Structure

```
grive_ease/
├── client/                  # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # React components
│   │   │   ├── Dashboard/  # Dashboard components
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── context/        # Context API providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions and API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── src/
    │   ├── Controllers/     # Route controllers
    │   ├── Models/          # Mongoose models
    │   ├── Routes/          # API routes
    │   ├── Schemas/         # MongoDB schemas
    │   ├── middleware/      # Authentication middleware
    │   ├── services/        # Business logic
    │   │   └── ai/          # Ollama integration
    │   ├── utils/           # Utility functions
    │   └── data/            # Data storage
    ├── uploads/             # File upload storage
    ├── config/              # Configuration files
    ├── index.js             # Entry point
    ├── package.json
    └── .env                 # Environment variables
```

---

## User Roles

### Student

- Register with student ID
- Lodge complaints against students, teachers, or facilities
- Track personal complaints
- View complaints filed against them
- Browse institutions

### Teacher

- Register with employee ID
- Lodge complaints against students, teachers, or facilities
- Track personal complaints
- View complaints filed against them
- Browse institutions

### Institutional Admin

- Register institution during signup
- View all complaints in the institution
- Update complaint status (Pending → In Progress → Resolved)
- View detailed analytics and statistics
- Monitor institution rating based on resolution performance

---

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET  /api/auth/me          - Get current user
PUT  /api/auth/me          - Update user profile
DELETE /api/auth/me        - Delete user account
```

### Complaint Endpoints

```
POST /api/complaints/lodge                    - Lodge new complaint (Student/Teacher)
GET  /api/complaints/history                  - Get user's complaint history
GET  /api/complaints/complaints-on-me         - Get complaints against user
GET  /api/complaints/institutional/all        - Get all institutional complaints (Admin)
GET  /api/complaints/:id                      - Get complaint details
PUT  /api/complaints/:id/status               - Update complaint status (Admin)
```

### Institution Endpoints

```
GET /api/institution/browse                   - Browse all institutions
GET /api/institution/:id                      - Get institution details
GET /api/institution/dashboard/stats          - Get dashboard statistics (Admin)
```

### AI/RAG Endpoints

```
POST /api/ask-ai-rag/upload    - Upload documents for RAG
POST /api/ask-ai-rag/query     - Ask AI questions
POST /api/ask-ai-rag/clear     - Clear RAG store
GET  /api/ask-ai-rag/health    - Health check
```

---

## Default Test Accounts

For testing purposes, you can create accounts with different roles:

### Student Account

- Role: Student
- Requires: Name, Email, Password, Institution Name, Department, Student ID

### Teacher Account

- Role: Teacher
- Requires: Name, Email, Password, Institution Name, Department, Employee ID

### Institutional Account

- Role: Institutional
- Creates new institution automatically
- Requires: Name, Email, Password, Institution Name

---

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- Verify MongoDB is accessible on the specified port

### Ollama Not Responding

- Ensure Ollama is installed and running (`ollama serve`)
- Check if the model is downloaded (`ollama list`)
- Verify `OLLAMA_HOST` and `OLLAMA_MODEL` in `.env`

### Port Already in Use

- Change the port in server `.env` file
- Update the API base URL in `client/src/utils/api.js`

### File Upload Issues

- Ensure `server/uploads` directory exists
- Check file size limits (default: 10MB)
- Verify file permissions

---

## Contributing

This project was developed by Team Golmaal. For contributions or issues, please contact the development team.

---

## License

This project is for educational purposes.

---

## Support

For any queries or support, please reach out to the development team.
