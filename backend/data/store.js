// In-memory / file-ready structured data store with initial sample data

const sampleDate = (day) => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${String(day).padStart(2, '0')}`;
};

export let expenses = [
  {
    id: "exp-1",
    title: "Grocery Shopping",
    amount: 1450,
    category: "Groceries",
    date: sampleDate(1),
    paymentMethod: "UPI",
    notes: "Weekly essentials from supermarket"
  },
  {
    id: "exp-2",
    title: "Electricity & WiFi Bill",
    amount: 2200,
    category: "Utilities",
    date: sampleDate(2),
    paymentMethod: "Net Banking",
    notes: "Monthly broadband and electricity"
  },
  {
    id: "exp-3",
    title: "Dinner with Friends",
    amount: 1100,
    category: "Food & Dining",
    date: sampleDate(3),
    paymentMethod: "Credit Card",
    notes: "Weekend cafe dining"
  },
  {
    id: "exp-4",
    title: "Metro & Cab Commute",
    amount: 650,
    category: "Transportation",
    date: sampleDate(4),
    paymentMethod: "UPI",
    notes: "Commute to college/work"
  },
  {
    id: "exp-5",
    title: "Cloud Subscriptions",
    amount: 799,
    category: "Entertainment",
    date: sampleDate(5),
    paymentMethod: "Debit Card",
    notes: "Streaming & developer services"
  }
];

export let incomes = [
  {
    id: "inc-1",
    title: "Monthly Stipend / Salary",
    amount: 35000,
    category: "Salary",
    date: sampleDate(1),
    paymentMethod: "Direct Deposit",
    notes: "Primary monthly income"
  },
  {
    id: "inc-2",
    title: "Freelance Project",
    amount: 8500,
    category: "Freelance",
    date: sampleDate(3),
    paymentMethod: "UPI",
    notes: "UI Design milestone payout"
  }
];

export const monthlyBudgetLimit = 25000;
