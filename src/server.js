import express from 'express';
import cors from 'cors';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'WuTong Mountain game backend is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WuTong Mountain Consciousness Evolution Game',
    status: 'active'
  });
});

// Port configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(Server running on port );
  console.log(Environment: );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
