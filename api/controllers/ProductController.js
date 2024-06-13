import { validationResult } from 'express-validator';
import Product from '../models/ProductModel.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter a listagem dos produtos', error: err.message });
  }
};

export const getProductByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = await Product.find({ userId });
    if (!products) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto pelo ID', error: err.message });
  }
};

/* export const getProductsByFilters = async (req, res) => {
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
}; */

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { quantidade, descricao, ...outrasProps } = req.body;
    const userId = req.user.userId;
    const justificativa = '';
    const descricaoTratada = descricao ?? '';

    const product = new Product({
      quantidade: parseInt(quantidade),
      justificativa: justificativa,
      userId,
      descricao: descricaoTratada,
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
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este produto' });
    }
    if (product.status !== 'Pendente') {
      return res.status(403).json({ message: 'Só é permitido excluir produtos com status Pendente' });
    }

    const result = await Product.findByIdAndDelete(productId);
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
    const product = await Product.findById(idDocumento);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    if (req.body.status != null){
      if (product.status != req.body.status) {
        return res.status(403).json({ message: 'Você não tem permissão para atualizar os status do produto' });
      }
    }
    if (product.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto' });
    }

    await Product.findByIdAndUpdate(idDocumento, req.body, { new: true });
    res.status(202).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status, justificativa } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.status !== 'Pendente') {
      return res.status(400).json({ message: 'O status só pode ser alterado se estiver "Pendente".' });
    }

    if (!['Aprovado', 'Negado'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Utilize "Aprovado" ou "Negado".' });
    }
    product.status = status;

    if (status === 'Negado') {
      product.justificativa = justificativa || '';
    } else {
      product.justificativa = undefined;
    }

    await product.save();
    res.status(200).json({ message: 'Status do produto atualizado com sucesso', product });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o status do produto', error: err.message });
  }
};

export const getProductsByFilters = async (req, res) => {
  const { dataMin, dataMax, nome, status, userId } = req.query;

  let filtroData = {};
  let filtroNome = {};
  let filtroStatus = {};
  let filtroUserId = {};

  if (dataMin !== undefined && dataMax !== undefined) {
    filtroData = { data: { $gte: new Date(dataMin), $lte: new Date(dataMax) } };
  } else if (dataMin !== undefined) {
    filtroData = { data: { $gte: new Date(dataMin) } };
  } else if (dataMax !== undefined) {
    filtroData = { data: { $lte: new Date(dataMax) } };
  }

  if (nome !== undefined) {
    filtroNome = { nome: new RegExp(nome, 'i') };
  }

  if (status !== undefined) {
    filtroStatus = { status };
  }

  if (userId !== undefined) {
    filtroUserId = { userId };
  }

  if (dataMin !== undefined && dataMax !== undefined && new Date(dataMin) >= new Date(dataMax)) {
    return res.status(400).json({ message: 'A data mínima é maior ou igual à data máxima.' });
  }

  if (Object.keys(filtroData).length === 0 && Object.keys(filtroNome).length === 0 &&
      Object.keys(filtroStatus).length === 0 && Object.keys(filtroUserId).length === 0) {
    return res.status(400).json({ message: 'É necessário fornecer pelo menos um parâmetro de filtro.' });
  }

  try {
    const products = await Product.find({ $and: [filtroData, filtroNome, filtroStatus, filtroUserId] });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter os produtos pelos filtros.', error: err.message });
  }
};
