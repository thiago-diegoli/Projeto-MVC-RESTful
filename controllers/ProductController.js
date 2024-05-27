// controllers/productController.js
import { validationResult } from 'express-validator';
import Product from '../models/ProductModel.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
  const { limit, skip, order } = req.query;
  try {
    const products = await Product.find()
      .limit(parseInt(limit) || 10)
      .skip(parseInt(skip) || 0)
      .sort({ [order]: 1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter a listagem dos produtos', error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto pelo ID', error: err.message });
  }
};

export const getProductsByFilters = async (req, res) => {
  const { qtdMin, qtdMax, precoMin, precoMax } = req.query;

  let filtroQtd = {};
  let filtroPreco = {};

  if (qtdMin !== undefined && qtdMax !== undefined) {
    filtroQtd = { quantidade: { $gte: parseInt(qtdMin), $lte: parseInt(qtdMax) } };
  } else if (qtdMin !== undefined) {
    filtroQtd = { quantidade: { $gte: parseInt(qtdMin) } };
  } else if (qtdMax !== undefined) {
    filtroQtd = { quantidade: { $lte: parseInt(qtdMax) } };
  }

  if (precoMin !== undefined && precoMax !== undefined) {
    filtroPreco = { preco: { $gte: parseFloat(precoMin), $lte: parseFloat(precoMax) } };
  } else if (precoMin !== undefined) {
    filtroPreco = { preco: { $gte: parseFloat(precoMin) } };
  } else if (precoMax !== undefined) {
    filtroPreco = { preco: { $lte: parseFloat(precoMax) } };
  }

  if (Object.keys(filtroQtd).length === 0 && Object.keys(filtroPreco).length === 0) {
    return res.status(400).json({ message: 'É necessário fornecer pelo menos um parâmetro de filtro (quantidade ou preço)' });
  } else if ((parseInt(qtdMin) >= parseInt(qtdMax)) || (parseFloat(precoMin) >= parseFloat(precoMax))) {
    return res.status(400).json({ message: 'Os parâmetros são iguais ou a quantidade mínima é maior que a máxima' });
  }

  try {
    const products = await Product.find({ $and: [filtroQtd, filtroPreco] });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto pelo filtro', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { quantidade, preco, ...outrasProps } = req.body;
    const product = new Product({
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
      ...outrasProps
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir o produto', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const idDocumento = req.body._id;
  delete req.body._id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const product = await Product.findByIdAndUpdate(idDocumento, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(202).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};
