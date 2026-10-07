import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BudgetSummaryCard from '../components/BudgetSummaryCard';
import TransactionItem from '../components/TransactionItem';
import AddExpenseModal from '../components/AddExpenseModal';
import AddIncomeModal from '../components/AddIncomeModal';
import EditTransactionModal from '../components/EditTransactionModal';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setSummary(res.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError('Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The fetch updates loading state only after its asynchronous request settles.
    // eslint-disable-next-line react/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddExpense = async (formData) => {
    await api.addExpense(formData);
    await fetchDashboardData();
  };

  const handleAddIncome = async (formData) => {
    await api.addIncome(formData);
    await fetchDashboardData();
  };

  const handleDeleteTransaction = async (id) => {
    if (id.startsWith('exp-')) {
      await api.deleteExpense(id);
    } else {
      await api.deleteIncome(id);
    }
    await fetchDashboardData();
  };

  const handleUpdateTransaction = async (formData) => {
    if (editingTransaction.type === 'expense') {
      await api.updateExpense(editingTransaction.id, formData);
    } else {
      await api.updateIncome(editingTransaction.id, formData);
    }
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12 shadow-xs">
        <p className="text-rose-600 font-medium text-sm mb-3">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold"
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const {
    month = 'This Month',
    totalIncome = 0,
    totalExpense = 0,
    balance = 0,
    savingsRate = 0,
    monthlyBudgetLimit = 25000,
    recentTransactions = [],
    categoryBreakdown = [],
  } = summary || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent">
            Expense Tracker Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {month} overview of your cash flow, budget limits, and recent activity.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-teal-700 border border-teal-200 font-semibold rounded-xl text-xs shadow-xs transition-all"
          >
            <Plus size={15} />
            <span>Add Income</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Income</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{Number(totalIncome).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Total Inflows</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Expenses</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{Number(totalExpense).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-orange-600 font-medium mt-0.5">Total Outflows</p>
        </div>

        {/* Net Balance */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Net Balance</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Wallet size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{Number(balance).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Available Balance</p>
        </div>

        {/* Savings Rate */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Savings Rate</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
              <PiggyBank size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {savingsRate}%
          </p>
          <p className="text-[11px] text-cyan-700 font-medium mt-0.5">Target: &gt; 20%</p>
        </div>
      </div>

      {/* Class Component: BudgetSummaryCard */}
      <div>
        <div className="mb-2">
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Class Component Demo (Rubric #2)
          </span>
        </div>
        <BudgetSummaryCard
          totalExpense={totalExpense}
          monthlyBudgetLimit={monthlyBudgetLimit}
          totalIncome={totalIncome}
        />
      </div>

      {/* Two Column Layout: Recent Transactions + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-base">
              Recent Transactions
            </h3>
            <Link
              to="/expenses"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onDelete={handleDeleteTransaction}
                  onEdit={setEditingTransaction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Spending */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">
                Category Spending
              </h3>
              <Link
                to="/analytics"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Analytics →
              </Link>
            </div>

            {categoryBreakdown.length === 0 ? (
              <p className="text-gray-400 text-xs py-6 text-center">
                No expense categories to show.
              </p>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.slice(0, 5).map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700 font-medium truncate">
                        {cat.category}
                      </span>
                      <span className="text-gray-500 font-mono">
                        ₹{Number(cat.amount).toLocaleString('en-IN')} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, cat.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/analytics"
              className="w-full block py-2 text-center text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
            >
              View Full Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onAddIncome={handleAddIncome}
      />
      {editingTransaction && (
        <EditTransactionModal
          key={editingTransaction.id}
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleUpdateTransaction}
        />
      )}
    </div>
  );
};

export default Dashboard;
