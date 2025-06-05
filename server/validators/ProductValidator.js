import { check } from 'express-validator';
import Product from '../models/ProductModel.js';

export const validaProduto = [
  check('nome')
    .notEmpty().withMessage('É obrigatório informar o nome'),
  check('tipo')
    .notEmpty().withMessage('O tipo é obrigatório'),
  check('quantidade')
    .notEmpty().withMessage('A quantidade é obrigatória')
    .isNumeric().withMessage('A quantidade deve ser um número')
    .isInt({ min: 1 }).withMessage('A quantidade deve ser maior ou igual a 1'),
  check('categoria')
    .notEmpty().withMessage('A categoria é obrigatória')
    .isString().withMessage('A categoria deve ser um texto')
    .trim()
    .isLength({ min: 1 }).withMessage('A categoria não pode estar vazia'),
];
