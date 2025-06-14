import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;

  try {
    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      category,
      amount,
      date,
      description
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};

export const updateTransaction = async (req, res) => {
    const { type, category, amount, date, description } = req.body;
  
    try {
      const transaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { type, category, amount, date, description },
        { new: true }
      );
  
      if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  
      res.status(200).json(transaction);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update transaction' });
    }
  };
  
