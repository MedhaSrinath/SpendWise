import express from 'express';
import { getIncomes, addIncome, updateIncome, deleteIncome } from '../controllers/incomeController.js';

const router = express.Router();

router.route('/')
  .get(getIncomes)
  .post(addIncome);

router.route('/:id')
  .put(updateIncome)
  .delete(deleteIncome);

export default router;
