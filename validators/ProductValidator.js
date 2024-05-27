import { check } from 'express-validator';
import Product from '../models/ProductModel.js';

export const validaProduto = [
  check('nome')
    .notEmpty().withMessage('É obrigatório informar o nome'),
  check('quantidade')
    .notEmpty().withMessage('A quantidade é obrigatória')
    .isNumeric().withMessage('A quantidade deve ter apenas números')
    .isLength({ min: 1 }).withMessage('A quantidade não pode ser menor que 1'),
  check('preco')
    .notEmpty().withMessage('O preço é obrigatório')
    .isNumeric().withMessage('O preço deve ter apenas números')
    .isLength({ min: 0 }).withMessage('O preço não pode ser menor que 0'),
  check('descricao')
    .notEmpty().withMessage('A descrição é obrigatória')
];