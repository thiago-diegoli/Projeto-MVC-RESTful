import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/mongodb.js';
import LoginRoute from './routes/LoginRoute.js';
import productRoutes from './routes/ProductRoute.js';
import cors from 'cors';
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'

dotenv.config();

const app = express();
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// Conectar ao MongoDB
connectToDatabase();

app.use(cors());
app.use(express.json())
app.disable('x-powered-by')

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.use('/api/logins', LoginRoute);
app.use('/api/products', productRoutes);

app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./swagger/swagger_output.json')),{customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL }))

// Iniciar o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});