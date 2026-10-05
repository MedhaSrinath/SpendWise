import { incomes } from '../data/store.js';

// GET all income entries
export const getIncomes = (req, res) => {
  try {
    const { category, search } = req.query;
    let filtered = [...incomes];

    if (category && category !== 'All') {
      filtered = filtered.filter(
        inc => inc.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        inc =>
          inc.title.toLowerCase().includes(q) ||
          inc.category.toLowerCase().includes(q)
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

// POST a new income
export const addIncome = (req, res) => {
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

    const newIncome = {
      id: `inc-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category: category.trim(),
      date,
      paymentMethod: paymentMethod || 'Direct Deposit',
      notes: notes ? notes.trim() : ''
    };

    incomes.unshift(newIncome);

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      data: newIncome
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE an income by ID
export const deleteIncome = (req, res) => {
  try {
    const { id } = req.params;
    const index = incomes.findIndex(inc => inc.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Income with id ${id} not found.`
      });
    }

    const deleted = incomes.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

