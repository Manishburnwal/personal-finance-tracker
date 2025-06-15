import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import CSVExport from '../components/CSVExport';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const budgetLimits = {
    Food: 3000,
    Shopping: 2000,
    Travel: 1500,
    Bills: 2500,
    Others: 1000,
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      alert('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (txn) => {
    setEditingTransaction(txn);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((txn) => txn.type === filter);

  const spendingByCategory = {};
  transactions.forEach((txn) => {
    if (txn.type === 'expense') {
      const cat = txn.category;
      if (!spendingByCategory[cat]) spendingByCategory[cat] = 0;
      spendingByCategory[cat] += txn.amount;
    }
  });

  const budgetAlerts = Object.keys(spendingByCategory)
    .filter((cat) => budgetLimits[cat] && spendingByCategory[cat] > budgetLimits[cat])
    .map((cat) => ({
      category: cat,
      spent: spendingByCategory[cat],
      limit: budgetLimits[cat],
    }));

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">📊 Dashboard</h1>
          <p className="text-gray-700 mt-1 text-sm sm:text-base">
            Hi, {user?.name} 👋 Welcome back!
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-tr from-green-100 to-white p-4 shadow rounded-xl border-l-4 border-green-500">
          <h3 className="text-sm text-gray-600">Total Income</h3>
          <p className="text-2xl font-bold text-green-700">₹ {totalIncome}</p>
        </div>
        <div className="bg-gradient-to-tr from-red-100 to-white p-4 shadow rounded-xl border-l-4 border-red-500">
          <h3 className="text-sm text-gray-600">Total Expense</h3>
          <p className="text-2xl font-bold text-red-700">₹ {totalExpense}</p>
        </div>
        <div className="bg-gradient-to-tr from-yellow-100 to-white p-4 shadow rounded-xl border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-600">Balance</h3>
          <p className="text-2xl font-bold text-gray-800">
            {balance >= 0 ? `₹ ${balance}` : `-₹ ${Math.abs(balance)}`}
          </p>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-red-50 border border-red-400 text-red-800 rounded-lg shadow">
          <ul className="list-disc ml-5 space-y-1">
            {budgetAlerts.map((alert) => (
              <li key={alert.category}>
                ⚠️ You exceeded your <strong>{alert.category}</strong> budget — spent ₹{alert.spent} (limit ₹{alert.limit})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transaction Form */}
      <TransactionForm
        onAdd={(txn) => setTransactions([txn, ...transactions])}
        editingTransaction={editingTransaction}
        onUpdate={(updatedTxn) => {
          setTransactions(
            transactions.map((txn) =>
              txn._id === updatedTxn._id ? updatedTxn : txn
            )
          );
          setEditingTransaction(null);
        }}
      />

      {/* Filter + Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 mb-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                filter === type ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <CSVExport transactions={filteredTransactions} />
      </div>

      {/* Charts */}
      <div className="overflow-x-auto mb-6">
        <Charts transactions={filteredTransactions} />
      </div>

      {/* Transaction List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <TransactionList
            transactions={filteredTransactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
