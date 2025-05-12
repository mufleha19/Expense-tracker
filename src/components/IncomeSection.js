import React from 'react';

export default function IncomeSection({ income, setIncome, handleIncomeSubmit }) {
  return (
    <div className="income-section">
      <h2>Income</h2>
      <input
        type="number"
        id="income"
        placeholder="Enter your income (INR)"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />
      <button onClick={handleIncomeSubmit}>Submit</button>
    </div>
  );
}