// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 },
  preco: { type: Number, required: true, min: 0 },
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
