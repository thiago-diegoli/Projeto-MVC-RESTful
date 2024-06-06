import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByFilters,
  createProduct,
  deleteProduct,
  updateProduct
} from '../controllers/ProductController.js';
import { validaProduto } from '../validators/ProductValidator.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getProducts);
router.get('/id/:id', auth, getProductById);
router.get('/filtros/', auth, getProductsByFilters);
router.post('/', auth, validaProduto, createProduct);
router.delete('/:id', auth, deleteProduct);
router.put('/', auth, validaProduto, updateProduct);

export default router;
