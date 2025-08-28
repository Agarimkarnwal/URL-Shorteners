import express from 'express';
import cors from 'cors';
import { createShortUrl, getShortUrl, getUrlStats } from './routes/urls';
import { connectDB } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/urls', createShortUrl);
app.get('/api/urls/:shortCode', getShortUrl);
app.get('/api/urls/:shortCode/stats', getUrlStats);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener API is running' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
