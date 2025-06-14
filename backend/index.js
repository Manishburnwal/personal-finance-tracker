import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();
const app = express();

connectDB();

app.use(cors({
  origin: 'https://personal-finance-tracker-frontend-meir.onrender.com',
  credentials: true
}));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('🚀 API Running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
