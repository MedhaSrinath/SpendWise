import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expenseController.js';
import { addIncome, updateIncome } from '../controllers/incomeController.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { expenses, incomes } from '../data/store.js';

const initialExpenses = expenses.map(item => ({ ...item }));
const initialIncomes = incomes.map(item => ({ ...item }));

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const createResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

beforeEach(() => {
  expenses.splice(0, expenses.length, ...initialExpenses.map(item => ({ ...item })));
  incomes.splice(0, incomes.length, ...initialIncomes.map(item => ({ ...item })));
});

test('expense create, filter, update, and delete work', () => {
  const created = createResponse();
  addExpense({
    body: {
      title: '  Test lunch  ',
      amount: '25.5',
      category: 'Food & Dining',
      date: today(),
    },
  }, created);
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.data.title, 'Test lunch');
  assert.equal(created.body.data.paymentMethod, 'UPI');

  const filtered = createResponse();
  getExpenses({ query: { category: 'Food & Dining', search: 'lunch' } }, filtered);
  assert.equal(filtered.body.count, 1);

  const updated = createResponse();
  updateExpense({
    params: { id: created.body.data.id },
    body: { ...created.body.data, title: 'Updated lunch', amount: 40 },
  }, updated);
  assert.equal(updated.statusCode, 200);
  assert.equal(updated.body.data.title, 'Updated lunch');
  assert.equal(updated.body.data.amount, 40);

  const deleted = createResponse();
  deleteExpense({ params: { id: created.body.data.id } }, deleted);
  assert.equal(deleted.statusCode, 200);
  assert.equal(expenses.some(item => item.id === created.body.data.id), false);
});

test('income create and update work, and invalid amounts are rejected', () => {
  const invalid = createResponse();
  addIncome({
    body: {
      title: 'Invalid amount',
      amount: '12abc',
      category: 'Salary',
      date: today(),
    },
  }, invalid);
  assert.equal(invalid.statusCode, 400);

  const created = createResponse();
  addIncome({
    body: {
      title: 'Tutoring',
      amount: 100,
      category: 'Freelance',
      date: today(),
    },
  }, created);
  assert.equal(created.statusCode, 201);

  const updated = createResponse();
  updateIncome({
    params: { id: created.body.data.id },
    body: { ...created.body.data, amount: 125 },
  }, updated);
  assert.equal(updated.statusCode, 200);
  assert.equal(updated.body.data.amount, 125);
});

test('dashboard totals and category percentages only include the current month', () => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  expenses.splice(0, expenses.length,
    { id: 'current-expense', title: 'Current', amount: 80, category: 'Food', date: `${currentMonth}-01` },
    { id: 'old-expense', title: 'Old', amount: 500, category: 'Travel', date: '2000-01-01' },
  );
  incomes.splice(0, incomes.length,
    { id: 'current-income', title: 'Current', amount: 200, category: 'Salary', date: `${currentMonth}-01` },
    { id: 'old-income', title: 'Old', amount: 900, category: 'Salary', date: '2000-01-01' },
  );

  const response = createResponse();
  getDashboardSummary({}, response);
  assert.equal(response.body.data.totalExpense, 80);
  assert.equal(response.body.data.totalIncome, 200);
  assert.equal(response.body.data.balance, 120);
  assert.equal(response.body.data.categoryBreakdown.length, 1);
  assert.equal(response.body.data.totalTransactions, 2);
});
