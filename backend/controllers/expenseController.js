import { expenses } from '../data/store.js';
import { normalizeTransaction } from '../utils/transactionValidation.js';

// GET all expenses, optionally filtered by category and search text.
export const getExpenses = (req, res) => {
  try {
    const { category, search } = req.query;
    let filtered = [...expenses];

    if (typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(
        exp => exp.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        exp =>
          exp.title.toLowerCase().includes(q) ||
          exp.category.toLowerCase().includes(q) ||
          (exp.notes && exp.notes.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST a new expense
export const addExpense = (req, res) => {
  try {
    const result = normalizeTransaction(req.body, { paymentMethod: 'UPI', notes: '' });
    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      ...result.value,
    };

    expenses.unshift(newExpense);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT a full expense record by ID.
export const updateExpense = (req, res) => {
  try {
    const expense = expenses.find(item => item.id === req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${req.params.id} not found.`,
      });
    }

    const result = normalizeTransaction(req.body, expense);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    Object.assign(expense, result.value);
    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE an expense by ID
export const deleteExpense = (req, res) => {
  try {
    const { id } = req.params;
    const index = expenses.findIndex(exp => exp.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${id} not found.`
      });
    }

    const deleted = expenses.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
