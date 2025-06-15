import React, { useState, useEffect } from 'react';
import API from '../services/api';

const TransactionForm = ({ onAdd, onUpdate, editingTransaction }) => {
  const [form, setForm] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        date: editingTransaction.date?.slice(0, 10),
        description: editingTransaction.description || '',
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        const res = await API.put(`/transactions/${editingTransaction._id}`, {
          ...form,
          amount: Number(form.amount),
        });
        onUpdate(res.data);
      } else {
        const res = await API.post('/transactions', {
          ...form,
          amount: Number(form.amount),
        });
        onAdd(res.data);
      }

      // Reset form
      setForm({ type: 'income', category: '', amount: '', date: '', description: '' });
    } catch (err) {
      alert('Failed to submit transaction');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          className="p-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="p-2 border rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          className="p-2 border rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Description (optional)"
          className="p-2 border rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-primary text-white p-2 rounded bg-orange-500 hover:bg-orange-400 transition"
      >
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
