import React from 'react';

const CATEGORY_COLORS = {
  Groceries: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Utilities: 'bg-amber-50 text-amber-700 border-amber-200',
  'Food & Dining': 'bg-orange-50 text-orange-700 border-orange-200',
  Transportation: 'bg-blue-50 text-blue-700 border-blue-200',
  Entertainment: 'bg-purple-50 text-purple-700 border-purple-200',
  Healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
  Education: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Shopping: 'bg-pink-50 text-pink-700 border-pink-200',
  Salary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Freelance: 'bg-teal-50 text-teal-700 border-teal-200',
  Investments: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const CategoryBadge = ({ category }) => {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
