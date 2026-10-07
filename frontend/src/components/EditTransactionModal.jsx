import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const EditTransactionModal = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: transaction.title,
    amount: String(transaction.amount),
    category: transaction.category,
    date: transaction.date,
    paymentMethod: transaction.paymentMethod || '',
    notes: transaction.notes || '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(formData.amount);

    if (!formData.title.trim() || !formData.category.trim() || !formData.date) {
      setError('Title, category, and date are required.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        amount,
      });
      onClose();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not update transaction.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-base font-bold text-gray-800">Edit Transaction</h2>
          <button type="button" onClick={onClose} aria-label="Close edit form">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 p-4">
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <label className="block text-xs font-semibold text-gray-700">
            Title *
            <input name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-gray-700">
              Amount (₹) *
              <input name="amount" type="number" min="0.01" step="any" value={formData.amount} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="block text-xs font-semibold text-gray-700">
              Category *
              <input name="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-gray-700">
              Date *
              <input name="date" type="date" value={formData.date} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="block text-xs font-semibold text-gray-700">
              Payment method
              <input name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
            </label>
          </div>

          <label className="block text-xs font-semibold text-gray-700">
            Notes
            <input name="notes" value={formData.notes} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal" />
          </label>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
