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
    enum: [
      "material-de-escritorio",
      "equipamentos-de-informatica",
      "material-de-limpeza",
      "materiais-didaticos-pedagogicos",
      "material-de-escritorio-especializado",
      "equipamentos-de-laboratorio",
      "material-de-construcao-manutencao",
      "moveis-equipamentos",
      "material-de-higiene-saude",
      "materiais-para-eventos-projetos-especiais",
      "materiais-esportivos-educacao-fisica",
      "recursos-tecnologicos-multimidia",
      "material-de-arte-design",
      "material-de-jardinagem-paisagismo",
      "material-de-seguranca-prevencao",
      "outro",
    ],
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
