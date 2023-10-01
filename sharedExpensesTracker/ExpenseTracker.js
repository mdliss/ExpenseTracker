// src/ExpenseTracker.js

import React, { useState } from 'react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');

  const addExpense = () => {
    if (newExpense.trim() !== '') {
      setExpenses([...expenses, newExpense]);
      setNewExpense('');
    }
  };

  return (
    <div>
      <h1>Shared Expenses Tracker</h1>
      <div>
        <input
          type="text"
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          placeholder="Enter an expense"
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>{expense}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
