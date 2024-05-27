import express from 'express';
import { register, login } from '../controllers/LoginController.js';
import { validaCadastro, validaLogin } from '../validators/LoginValidator.js';

const router = express.Router();

router.post('/cadastro', validaCadastro, register);
router.post('/', validaLogin, login);

export default router;