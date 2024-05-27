// controllers/authController.js
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/LoginModel.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }
    
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario = new User({ nome, email, senha: senhaCriptografada });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const senhaCorrespondente = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorrespondente) {
      return res.status(403).json({ message: 'Senha incorreta' });
    }

    jwt.sign({ userId: usuario._id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ access_token: token });
    });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};
