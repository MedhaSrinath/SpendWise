const isValidDate = (date) => {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date;
};

export const normalizeTransaction = (input, existing = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Please provide transaction details.' };
  }

  const transaction = { ...existing, ...input };
  const title = typeof transaction.title === 'string' ? transaction.title.trim() : '';
  const category = typeof transaction.category === 'string' ? transaction.category.trim() : '';
  const date = transaction.date;
  const amount = Number(transaction.amount);
  const paymentMethod = transaction.paymentMethod ?? existing.paymentMethod ?? '';
  const notes = transaction.notes ?? existing.notes ?? '';

  if (!title || !category || !isValidDate(date)) {
    return { error: 'Please provide a title, category, and valid date.' };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'Amount must be a positive number.' };
  }

  if (typeof paymentMethod !== 'string' || typeof notes !== 'string') {
    return { error: 'Payment method and notes must be text.' };
  }

  return {
    value: {
      title,
      amount,
      category,
      date,
      paymentMethod: paymentMethod.trim(),
      notes: notes.trim(),
    },
  };
};
