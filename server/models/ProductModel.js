import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: {
    type: String,
    required: true,
  },
  quantidade: { type: Number, required: true, min: 1 },
  categoria: {
    type: String,
    required: true,
  },
  descricao: { type: String },
  data: { type: Date, default: Date.now, required: true },
  status: {
    type: String,
    enum: ["Pendente", "Aprovado", "Negado"],
    default: "Pendente",
    required: true,
  },
  justificativa: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Product", productSchema);
