import { expenses } from '../data/store.js';

// GET all expenses (with optional query filter: category, search, timeFrame)
export const getExpenses = (req, res) => {
  try {
    const { category, search, timeFrame } = req.query;
    let filtered = [...expenses];

    if (category && category !== 'All') {
      filtered = filtered.filter(
        exp => exp.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
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
    const { title, amount, category, date, paymentMethod, notes } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, category, and date.'
      });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number.'
      });
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category: category.trim(),
      date,
      paymentMethod: paymentMethod || 'UPI',
      notes: notes ? notes.trim() : ''
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

