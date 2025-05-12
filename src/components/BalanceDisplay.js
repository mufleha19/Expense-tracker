import React from 'react';

export default function BalanceDisplay({ income, totalExpenses }) {
  return (
    <div className="balance-display">
      <h3>Balance: Rs<span id="balance">{(income - totalExpenses).toFixed(2)}</span></h3>
    </div>
  );
}