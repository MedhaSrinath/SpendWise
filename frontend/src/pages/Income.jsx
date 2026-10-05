import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  TrendingUp,
  Loader2,
  Filter,
} from 'lucide-react';
import api from '../services/api';
import TransactionItem from '../components/TransactionItem';
import AddIncomeModal from '../components/AddIncomeModal';

const INCOME_CATEGORIES = ['All', 'Salary', 'Freelance', 'Investments', 'Allowance', 'Business', 'Other'];

export const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getIncomes({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm ? searchTerm : undefined,
      });
      if (res.success) {
        setIncomes(res.data);
      }
    } catch (err) {
      console.error('Error fetching income:', err);
      setError('Failed to load income records from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [selectedCategory, searchTerm]);

  const handleAddIncome = async (formData) => {
    await api.addIncome(formData);
    await fetchIncomes();
  };

  const handleDeleteIncome = async (id) => {
    await api.deleteIncome(id);
    await fetchIncomes();
  };

  const totalIncomeAmount = incomes.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Income</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
              {incomes.length} Streams
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track and manage your salary and revenue sources.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all"
        >
          <Plus size={15} />
          <span>Add Income</span>
        </button>
      </div>

      {/* Filter Bar */}
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
              placeholder="Search income by source or title..."
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
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Income Streams' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500">
        <span>Showing {incomes.length} records</span>
        <span>
          Total Inflow:{' '}
          <strong className="text-emerald-600 font-bold text-sm">
            ₹{totalIncomeAmount.toLocaleString('en-IN')}
          </strong>
        </span>
      </div>

      {/* Income List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          <p className="text-gray-400 text-xs">Loading records...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center text-rose-600 text-xs">
          {error}
        </div>
      ) : incomes.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-2">
          <TrendingUp size={24} className="mx-auto text-gray-400" />
          <p className="text-gray-600 text-sm font-medium">No income records</p>
          <p className="text-gray-400 text-xs">Add your first income stream using the button above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {incomes.map((income) => (
            <TransactionItem
              key={income.id}
              transaction={{ ...income, type: 'income' }}
              onDelete={handleDeleteIncome}
            />
          ))}
        </div>
      )}

      <AddIncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIncome={handleAddIncome}
      />
    </div>
  );
};

export default Income;
