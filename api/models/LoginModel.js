import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  cargo: { type: String, enum: ['user', 'admin'], default: 'user' }
});

export default mongoose.model('User', userSchema);