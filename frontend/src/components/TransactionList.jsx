import React from 'react';

const TransactionList = ({ transactions, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((txn) => (
              <tr key={txn._id} className="border-t">
                <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">₹ {txn.amount}</td>
                <td className="p-2 capitalize">{txn.type}</td>
                <td className="p-2">{txn.description || '-'}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(txn._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
