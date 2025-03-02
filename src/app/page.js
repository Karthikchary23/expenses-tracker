"use client";
import React, { useState, useEffect } from "react";

export default function ExpenseTracker() {
  const [initialAmount, setInitialAmount] = useState("");
  const [cash, setCash] = useState(0);
  const [online, setOnline] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");

  // Load data from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCash(parseFloat(localStorage.getItem("cash")) || 0);
      setOnline(parseFloat(localStorage.getItem("online")) || 0);
      setTransactions(JSON.parse(localStorage.getItem("transactions")) || []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cash", cash);
      localStorage.setItem("online", online);
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [cash, online, transactions]);

  const handleSetInitialAmount = () => {
    setCash(parseFloat(initialAmount) || 0);
    setOnline(0);
    setTransactions([]);
    setInitialAmount("");
  };

  const addTransaction = (type, method) => {
    const transactionAmount = parseFloat(amount);
    if (!transactionAmount || !reason) return;

    const newTransaction = {
      reason,
      amount: type === "add" ? transactionAmount : -transactionAmount,
      method,
      date: new Date().toLocaleString(),
    };

    setTransactions([...transactions, newTransaction]);
    if (method === "Cash") {
      setCash(cash + (type === "add" ? transactionAmount : -transactionAmount));
    } else {
      setOnline(online + (type === "add" ? transactionAmount : -transactionAmount));
    }

    setReason("");
    setAmount("");
  };

  const clearAllData = () => {
    setCash(0);
    setOnline(0);
    setTransactions([]);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Set Initial Amount</h2>
        <input 
          type="number" 
          value={initialAmount} 
          onChange={(e) => setInitialAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2" 
          placeholder="Enter initial amount" 
        />
        <button 
          onClick={handleSetInitialAmount} 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Set Initial Amount
        </button>
      </div>

      <h2 className="text-xl font-bold">Total Balance: ₹{cash + online}</h2>
      <h3 className="text-green-600">Cash: ₹{cash}</h3>
      <h3 className="text-blue-600">Online: ₹{online}</h3>

      <div className="bg-gray-100 p-4 rounded shadow my-4">
        <h2 className="text-lg font-semibold mb-2">Add Transaction</h2>
        <input 
          type="text" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 rounded w-full mb-2" 
          placeholder="Reason" 
        />
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2" 
          placeholder="Amount" 
        />
        <div className="flex gap-2">
          <button onClick={() => addTransaction("add", "Cash")} className="bg-green-500 text-white px-4 py-2 rounded w-1/2 hover:bg-green-600">Add Cash</button>
          <button onClick={() => addTransaction("add", "Online")} className="bg-green-500 text-white px-4 py-2 rounded w-1/2 hover:bg-green-600">Add Online</button>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => addTransaction("spend", "Cash")} className="bg-red-500 text-white px-4 py-2 rounded w-1/2 hover:bg-red-600">Spend Cash</button>
          <button onClick={() => addTransaction("spend", "Online")} className="bg-red-500 text-white px-4 py-2 rounded w-1/2 hover:bg-red-600">Spend Online</button>
        </div>
      </div>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Reason</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Method</th>
            <th className="p-2">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{transaction.reason}</td>
              <td className={`p-2 ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{transaction.amount}
              </td>
              <td className="p-2">{transaction.method}</td>
              <td className="p-2">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={clearAllData} 
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-600"
      >
        Clear All Data
      </button>
    </div>
  );
}
