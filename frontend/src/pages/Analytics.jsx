import React, { useState, useEffect, useCallback } from 'react';
import {
  PieChart,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';

export const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setSummary(res.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to fetch analytics from backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The fetch updates loading state only after its asynchronous request settles.
    // eslint-disable-next-line react/set-state-in-effect
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-2">
        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
        <p className="text-gray-400 text-xs">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center text-rose-600 text-xs">
        {error}
      </div>
    );
  }

  const {
    month = 'This Month',
    totalIncome = 0,
    totalExpense = 0,
    balance = 0,
    savingsRate = 0,
    categoryBreakdown = [],
  } = summary || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <PieChart className="text-teal-600" />
          <span>Financial Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {month} spending breakdown and savings efficiency.
        </p>
      </div>

      {/* 3 Summary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Savings Efficiency
          </span>
          <p className="text-2xl font-bold text-emerald-600">
            {savingsRate}%
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {savingsRate >= 20 ? 'Above target benchmark (20%)' : 'Below target benchmark (20%)'}
          </p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Net Surplus
          </span>
          <p className="text-2xl font-bold text-teal-700">
            ₹{Number(balance).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Total cash reserves
          </p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Expense Ratio
          </span>
          <p className="text-2xl font-bold text-orange-600">
            {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Of total monthly income
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">
            Category Spending Distribution
          </h3>
          <span className="text-xs text-gray-500">
            Total Outflow: ₹{Number(totalExpense).toLocaleString('en-IN')}
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-6">
            No expenses available for category distribution.
          </p>
        ) : (
          <div className="space-y-3.5">
            {categoryBreakdown.map((cat, idx) => {
              const colors = [
                'bg-teal-500',
                'bg-cyan-500',
                'bg-amber-500',
                'bg-rose-500',
                'bg-indigo-500',
                'bg-purple-500',
              ];
              const barColor = colors[idx % colors.length];

              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">
                      {cat.category}
                    </span>
                    <span className="text-gray-500 font-mono">
                      ₹{Number(cat.amount).toLocaleString('en-IN')} ({cat.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 50-30-20 Rule Card */}
      <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
        <div className="flex items-center space-x-2 text-teal-700 font-semibold text-sm mb-2">
          <CheckCircle size={16} />
          <span>50-30-20 Budget Rule Guideline</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Allocate 50% of your earnings to essential Needs (groceries, utilities), 30% to Wants (dining, recreation), and 20% directly into Savings and investments.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
