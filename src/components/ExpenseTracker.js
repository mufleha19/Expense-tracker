import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { ref, onValue, set, off } from 'firebase/database';
import { db } from '../firebase';
import IncomeSection from './IncomeSection';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ChartSection from './ChartSection';
import BalanceDisplay from './BalanceDisplay';

export default function ExpenseTracker() {
  const { currentUser, logout } = useAuth();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: 'Food and Groceries'
  });

  useEffect(() => {
    if (!currentUser) return;

    const userExpensesRef = ref(db, `users/${currentUser.uid}/expenses`);
    const userIncomeRef = ref(db, `users/${currentUser.uid}/income`);

    // Load expenses
    onValue(userExpensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expensesArray = Object.values(data);
        setExpenses(expensesArray);
        calculateTotalExpenses(expensesArray);
      } else {
        setExpenses([]);
        setTotalExpenses(0);
      }
    });

    // Load income
    onValue(userIncomeRef, (snapshot) => {
      const data = snapshot.val();
      setIncome(data || 0);
    });

    return () => {
      off(userExpensesRef);
      off(userIncomeRef);
    };
  }, [currentUser]);

  const calculateTotalExpenses = (expenseList) => {
    const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  };

  const handleIncomeSubmit = async () => {
    const incomeValue = parseFloat(income) || 0;
    await set(ref(db, `users/${currentUser.uid}/income`), incomeValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const { description, amount, date, category } = formData;
    const parsedAmount = parseFloat(amount);

    if (!description || isNaN(parsedAmount) || parsedAmount <= 0 || !date) {
      alert("Please enter valid description, amount, and date.");
      return;
    }

    const expense = { 
      description, 
      amount: parsedAmount, 
      date, 
      category 
    };

    let updatedExpenses;
    
    if (editingIndex !== null) {
      updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = expense;
      setEditingIndex(null);
    } else {
      updatedExpenses = [...expenses, expense];
    }

    await set(ref(db, `users/${currentUser.uid}/expenses`), updatedExpenses);
    calculateTotalExpenses(updatedExpenses);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      description: '',
      amount: '',
      date: '',
      category: 'Food and Groceries'
    });
  };

  const editExpense = (index) => {
    const expense = expenses[index];
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category
    });
    setEditingIndex(index);
  };

  const deleteExpense = async (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    await set(ref(db, `users/${currentUser.uid}/expenses`), updatedExpenses);
    calculateTotalExpenses(updatedExpenses);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Income And Expenditure Tracker</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>
      
      <div className="container">
        <div className="left-section">
          <IncomeSection 
            income={income} 
            setIncome={setIncome} 
            handleIncomeSubmit={handleIncomeSubmit} 
          />
          
          <ExpenseForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleExpenseSubmit={handleExpenseSubmit} 
            clearForm={clearForm} 
            editingIndex={editingIndex} 
          />
          
          <BalanceDisplay income={income} totalExpenses={totalExpenses} />
        </div>
        
        <div className="center-section">
          <ExpenseTable 
            expenses={expenses} 
            editExpense={editExpense} 
            deleteExpense={deleteExpense} 
          />
        </div>
        
        <div className="right-section">
          <ChartSection expenses={expenses} totalExpenses={totalExpenses} />
        </div>
      </div>
    </div>
  );
}