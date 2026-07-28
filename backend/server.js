const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const { handleErrors } = require('./middleware/handleErrors');

require('dotenv').config();

// Import routes
const signUpRoute = require('./routes/signUpRoute');
const signInRoute = require('./routes/signInRoute');
const logoutRoute = require('./routes/logoutRoute');
const refreshTokenRoute = require('./routes/refreshTokenRoute');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const remoteJobsRoute = require('./routes/remoteJobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN
].filter(Boolean);

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman and server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication Routes
app.use('/api/auth', signUpRoute);
app.use('/api/auth', signInRoute);
app.use('/api/auth', logoutRoute);
app.use('/api/auth/refresh', refreshTokenRoute);

// Application Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', remoteJobsRoute);
app.use('/api', require('./routes/marketIntelligence'));
app.use('/api', require('./routes/health'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JobNova API is running 🚀',
    version: '2.0.0',
    features: [
      'User Authentication',
      'Job Management',
      'Application Tracking',
      'Resume Upload',
      'Advanced Search',
      'AI Features'
    ]
  });
});

// Global Error Handler
app.use(handleErrors);

// Start Server
app.listen(PORT, () => {
  console.log(` JobNova Server running on port ${PORT}`);
});