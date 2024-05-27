import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/mongodb.js';
import LoginRoute from './routes/LoginRoute.js';
import productRoutes from './routes/ProductRoute.js';

dotenv.config();

const app = express();

// Conectar ao MongoDB
connectToDatabase();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.use('/api/logins', LoginRoute);
app.use('/api/products', productRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
