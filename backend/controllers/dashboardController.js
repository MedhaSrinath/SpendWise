import { expenses, incomes, monthlyBudgetLimit } from '../data/store.js';

export const getDashboardSummary = (req, res) => {
  try {
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (((balance) / totalIncome) * 100).toFixed(1) : 0;

    // Calculate category-wise expenses
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = Object.keys(categoryTotals).map(category => ({
      category,
      amount: categoryTotals[category],
      percentage: totalExpense > 0 ? ((categoryTotals[category] / totalExpense) * 100).toFixed(1) : 0
    }));

    // Recent combined transactions
    const combined = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...incomes.map(i => ({ ...i, type: 'income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Budget utilization
    const budgetUtilization = ((totalExpense / monthlyBudgetLimit) * 100).toFixed(1);
    const isOverBudget = totalExpense > monthlyBudgetLimit;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate: Number(savingsRate),
        monthlyBudgetLimit,
        budgetUtilization: Number(budgetUtilization),
        isOverBudget,
        categoryBreakdown,
        recentTransactions: combined.slice(0, 6),
        totalTransactions: combined.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

