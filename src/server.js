import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'WuTong Mountain game backend is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(Server running on port );
});
