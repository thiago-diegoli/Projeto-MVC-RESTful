import { check } from 'express-validator';
import Product from '../models/ProductModel.js';

const allowedTypes = [
  'material-de-consumo',
  'material-permanente',
  'hibrido'
];

const allowedCategories = [
  'material-de-escritorio',
  'equipamentos-de-informatica',
  'material-de-limpeza',
  'materiais-didaticos-pedagogicos',
  'material-de-escritorio-especializado',
  'equipamentos-de-laboratorio',
  'material-de-construcao-manutencao',
  'moveis-equipamentos',
  'material-de-higiene-saude',
  'materiais-para-eventos-projetos-especiais',
  'materiais-esportivos-educacao-fisica',
  'recursos-tecnologicos-multimidia',
  'material-de-arte-design',
  'material-de-jardinagem-paisagismo',
  'material-de-seguranca-prevencao',
  'outro'
];

export const validaProduto = [
  check('nome')
    .notEmpty().withMessage('É obrigatório informar o nome'),

  check('tipo')
    .notEmpty().withMessage('O tipo é obrigatório')
    .isIn(allowedTypes).withMessage('O tipo informado é inválido'),

  check('quantidade')
    .notEmpty().withMessage('A quantidade é obrigatória')
    .isNumeric().withMessage('A quantidade deve ser um número')
    .isInt({ min: 1 }).withMessage('A quantidade deve ser maior ou igual a 1'),

  check('categoria')
    .notEmpty().withMessage('A categoria é obrigatória')
    .isIn(allowedCategories).withMessage('A categoria informada é inválida'),
];