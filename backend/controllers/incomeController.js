import { incomes } from '../data/store.js';
import { normalizeTransaction } from '../utils/transactionValidation.js';

// GET all income entries
export const getIncomes = (req, res) => {
  try {
    const { category, search } = req.query;
    let filtered = [...incomes];

    if (typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(
        inc => inc.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (typeof search === 'string' && search.trim() !== '') {
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
    const result = normalizeTransaction(req.body, { paymentMethod: 'Direct Deposit', notes: '' });
    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const newIncome = {
      id: `inc-${Date.now()}`,
      ...result.value,
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

// PUT a full income record by ID.
export const updateIncome = (req, res) => {
  try {
    const income = incomes.find(item => item.id === req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: `Income with id ${req.params.id} not found.`,
      });
    }

    const result = normalizeTransaction(req.body, income);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    Object.assign(income, result.value);
    return res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      data: income,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
