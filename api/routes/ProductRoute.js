import express from 'express';
import {
  getProducts,
  getProductByUserId,
  // getProductsByFilters,
  createProduct,
  deleteProduct,
  // updateProduct,
  updateProductStatus,
  getProductsByFilters
} from '../controllers/ProductController.js';
import { validaProduto } from '../validators/ProductValidator.js';
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

router.get('/', auth, getProductByUserId);
router.get('/products', getProductsByFilters);
// router.get('/filtros/', auth, getProductsByFilters);
router.post('/', auth, validaProduto, createProduct);
router.delete('/:id', auth, deleteProduct);

// Rotas que precisam de permissão de administrador
router.get('/all', authAdmin, getProducts);
router.put('/', authAdmin, validaProduto, updateProductStatus);


export default router;
