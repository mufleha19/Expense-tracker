import React from 'react';

export default function ExpenseTable({ expenses, editExpense, deleteExpense }) {
  return (
    <div className="expense-table-container">
      <h2>Expense Records</h2>
      <table id="expenseTable">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (Rs)</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No expenses recorded yet</td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.description}</td>
                <td>Rs{expense.amount.toFixed(2)}</td>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td className="action-buttons">
                  <button onClick={() => editExpense(index)}>Edit</button>
                  <button onClick={() => deleteExpense(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}