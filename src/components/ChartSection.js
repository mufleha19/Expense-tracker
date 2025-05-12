
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
];

export default function ChartSection({ expenses, totalExpenses }) {
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const donutChartInstance = useRef(null);
  
  useEffect(() => {
    if (barChartRef.current && donutChartRef.current) {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();

      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Expenses (Rs)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });

      donutChartInstance.current = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            label: 'Expenses (Rs)',
            data: [],
            backgroundColor: CHART_COLORS
          }]
        }
      });

      updateCharts();
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    updateCharts();
  }, [expenses]);

  const updateCharts = () => {
    if (!barChartInstance.current || !donutChartInstance.current) return;

    const categories = [...new Set(expenses.map(exp => exp.category))];
    const categoryTotals = categories.map(category => {
      return expenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    barChartInstance.current.data.labels = categories;
    barChartInstance.current.data.datasets[0].data = categoryTotals;
    barChartInstance.current.update();

    donutChartInstance.current.data.labels = categories;
    donutChartInstance.current.data.datasets[0].data = categoryTotals;
    donutChartInstance.current.update();
  };

  return (
    <div className="charts-section">
      <h2>Expense Breakdown</h2>
      <div className="chart-item">
        <h3>Expense Categories (Donut Chart)</h3>
        <canvas ref={donutChartRef}></canvas>
      </div>
      <h3>Total Amount Spent: Rs<span id="totalSpent">{totalExpenses.toFixed(2)}</span></h3>
      <div id="barChartContainer">
        <h3 className="bar-chart-title">Expenses Overview (Bar Chart)</h3>
        <canvas ref={barChartRef}></canvas>
      </div>
    </div>
  );
}