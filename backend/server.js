import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'SpendWise Expense Tracker REST API is running!',
    endpoints: {
      expenses: '/api/expenses',
      income: '/api/income',
      dashboardSummary: '/api/dashboard/summary'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 SpendWise Express Server running on http://localhost:${PORT}`);
});

