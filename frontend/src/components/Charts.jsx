import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

const Charts = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expense', value: expense },
  ];

  const categoryMap = {};
  transactions.forEach((txn) => {
    if (!categoryMap[txn.category]) {
      categoryMap[txn.category] = 0;
    }
    categoryMap[txn.category] += txn.amount;
  });

  const barData = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    amount: categoryMap[cat],
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">
      {/* Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-center text-lg font-semibold mb-2">Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={60}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-center text-lg font-semibold mb-2">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#E0531F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
