import React from 'react';
import { CSVLink } from 'react-csv';

const CSVExport = ({ transactions }) => {
  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
    { label: 'Type', key: 'type' },
    { label: 'Description', key: 'description' }
  ];

  const data = transactions.map((txn) => ({
    ...txn,
    date: new Date(txn.date).toLocaleDateString(),
  }));

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename="transactions.csv"
      className="bg-primary text-black px-4 py-2 rounded hover:bg-orange-700 hover:text-white"
    >
      📥 Export CSV
    </CSVLink>
  );
};

export default CSVExport;
