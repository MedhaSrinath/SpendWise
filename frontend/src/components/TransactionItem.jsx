import React, { useState } from 'react';
import { Trash2, TrendingDown, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export const TransactionItem = ({ transaction, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isExpense = transaction.type === 'expense' || !transaction.type || transaction.type === undefined;

  const handleDelete = async () => {
    if (window.confirm(`Delete "${transaction.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(transaction.id);
      } catch (err) {
        console.error('Failed to delete transaction', err);
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group flex items-center justify-between p-3.5 bg-white hover:bg-gray-50/80 border border-gray-100 hover:border-gray-200 rounded-xl transition-all shadow-xs">
      <div className="flex items-center space-x-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isExpense
              ? 'bg-orange-50 text-orange-600 border border-orange-100'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}
        >
          {isExpense ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-800 truncate">
              {transaction.title}
            </h4>
            <CategoryBadge category={transaction.category} />
          </div>

          <div className="flex items-center space-x-3 mt-0.5 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </span>
            {transaction.paymentMethod && (
              <span className="flex items-center space-x-1">
                <CreditCard size={12} />
                <span>{transaction.paymentMethod}</span>
              </span>
            )}
            {transaction.notes && (
              <span className="hidden md:inline truncate max-w-xs text-gray-400 italic">
                "{transaction.notes}"
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0 ml-4">
        <span
          className={`text-sm md:text-base font-bold ${
            isExpense ? 'text-orange-600' : 'text-emerald-600'
          }`}
        >
          {isExpense ? '-' : '+'}₹{Number(transaction.amount).toLocaleString('en-IN')}
        </span>

        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete record"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
