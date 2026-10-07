import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Filter,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import TransactionItem from '../components/TransactionItem';
import AddExpenseModal from '../components/AddExpenseModal';
import EditTransactionModal from '../components/EditTransactionModal';

const CATEGORIES = [
  'All',
  'Groceries',
  'Utilities',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
];

export const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Student Modification 1: Category Filtering and Search State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses with category and search filter query parameters
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await api.getExpenses({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm ? searchTerm : undefined,
      });
      if (res.success) {
        setExpenses(res.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses from backend.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    // The fetch updates loading state only after its asynchronous request settles.
    // eslint-disable-next-line react/set-state-in-effect
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (formData) => {
    await api.addExpense(formData);
    await fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    await api.deleteExpense(id);
    await fetchExpenses();
  };

  const handleUpdateExpense = async (formData) => {
    await api.updateExpense(editingExpense.id, formData);
    await fetchExpenses();
  };

  const totalFilteredAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Expenses</span>
            <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full font-semibold">
              {expenses.length} Records
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track, manage, and filter your outgoing expenses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search
              size={16}
              className="absolute inset-y-0 left-3 my-auto text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses by title or notes..."
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div className="relative">
            <Filter
              size={15}
              className="absolute inset-y-0 left-3 my-auto text-gray-400"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Tabs */}
        <div className="hidden lg:flex items-center space-x-1.5 pt-3 mt-3 border-t border-gray-100 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 mr-1">Quick Filter:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary count and total */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500">
        <span>Showing {expenses.length} expenses</span>
        <span>
          Total for selected category:{' '}
          <strong className="text-orange-600 font-bold text-sm">
            ₹{totalFilteredAmount.toLocaleString('en-IN')}
          </strong>
        </span>
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          <p className="text-gray-400 text-xs">Loading records...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center text-rose-600 text-xs">
          {error}
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-2">
          <TrendingDown size={24} className="mx-auto text-gray-400" />
          <p className="text-gray-600 text-sm font-medium">No expenses found</p>
          <p className="text-gray-400 text-xs">
            {searchTerm || selectedCategory !== 'All'
              ? 'No records match your selected filter.'
              : 'Add your first expense using the button above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <TransactionItem
              key={expense.id}
              transaction={{ ...expense, type: 'expense' }}
              onDelete={handleDeleteExpense}
              onEdit={setEditingExpense}
            />
          ))}
        </div>
      )}

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
      {editingExpense && (
        <EditTransactionModal
          key={editingExpense.id}
          transaction={{ ...editingExpense, type: 'expense' }}
          onClose={() => setEditingExpense(null)}
          onSave={handleUpdateExpense}
        />
      )}
    </div>
  );
};

export default Expenses;
