import express from 'express';
import { addTransaction, getTransactions, deleteTransaction, updateTransaction } from '../controllers/transactionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addTransaction);
router.get('/', protect, getTransactions);
router.delete('/:id', protect, deleteTransaction);
router.put('/:id', protect, updateTransaction);


export default router;
