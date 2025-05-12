import React from 'react';

const EXPENSE_CATEGORIES = [
  'Food and Groceries',
  'Transportation',
  'Housing',
  'Utilities',
  'Personal Care',
  'Entertainment',
  'Healthcare',
  'Education',
  'Clothing',
  'Savings and Investments',
  'Other'
];

export default function ExpenseForm({ formData, handleInputChange, handleExpenseSubmit, clearForm, editingIndex }) {
  return (
    <form className="expense-form" onSubmit={handleExpenseSubmit}>
      <h2>Add Expenditure</h2>
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount (INR)"
        value={formData.amount}
        onChange={handleInputChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
      >
        {EXPENSE_CATEGORIES.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit">
        {editingIndex !== null ? 'Update Expense' : 'Add Expense'}
      </button>
      <button type="button" onClick={clearForm}>
        New Expense
      </button>
    </form>
  );
}
