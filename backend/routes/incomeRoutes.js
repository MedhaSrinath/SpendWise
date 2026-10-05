import express from 'express';
import { getIncomes, addIncome, deleteIncome } from '../controllers/incomeController.js';

const router = express.Router();

router.route('/')
  .get(getIncomes)
  .post(addIncome);

router.route('/:id')
  .delete(deleteIncome);

export default router;

