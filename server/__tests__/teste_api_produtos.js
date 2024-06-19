const request = require('supertest');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const baseURL = 'http://localhost:4000/api';

describe('API REST de Login e Cadastro', () => {
  let token;
  let idProduto;

  it('POST /cadastro - Cadastro de novo usuário comum', async () => {
    const userData = {
      nome: 'Usuario Teste',
      email: 'usuario.teste@email.com',
      senha: 'senha123'
    };

    const response = await request(baseURL)
      .post('/logins/cadastro')
      .set('Content-Type', 'application/json')
      .send(userData)
      .expect(201);

    expect(response.body.email).toBe(userData.email);
    expect(response.body.nome).toBe(userData.nome);
  });

  it('POST / - Login de um usuário comum', async () => {
    const loginData = {
      email: 'usuario.teste@email.com',
      senha: 'senha123'
    };

    const response = await request(baseURL)
      .post('/logins')
      .set('Content-Type', 'application/json')
      .send(loginData)
      .expect(200);

      expect(response.body).toHaveProperty('access_token');
      token = response.body.access_token;
  });

  it('POST /cadastro - Tentativa de cadastro de administrador (apenas para teste)', async () => {
    const adminData = {
      nome: 'Administrador Teste',
      email: 'admin.teste@admin.com',
      senha: 'admin123'
    };

    const response = await request(baseURL)
      .post('/logins/cadastro')
      .set('Content-Type', 'application/json')
      .send(adminData)
      .expect(201);

    expect(response.body.email).toBe(adminData.email);
    expect(response.body.nome).toBe(adminData.nome);
  });

  it('POST / - Tentativa de login de administrador (apenas para teste)', async () => {
    const loginData = {
      email: 'admin.teste@admin.com',
      senha: 'admin123'
    };

    const response = await request(baseURL)
      .post('/logins')
      .set('Content-Type', 'application/json')
      .send(loginData)
      .expect(200);

      expect(response.body).toHaveProperty('access_token');
  });

  it('POST / - Tentativa de login com credenciais inválidas', async () => {
    const invalidLoginData = {
      email: 'usuario.inexistente@email.com',
      senha: 'senhaerrada'
    };

    const response = await request(baseURL)
      .post('/logins')
      .set('Content-Type', 'application/json')
      .send(invalidLoginData)
      .expect(404);

    expect(response.body.message).toBe('Usuário não encontrado');
  });
});

describe('API REST de Produtos', () => {
  let token;

  // Recupera o token válido a partir do login de um usuário de teste
  beforeAll(async () => {
    const loginData = {
      email: 'usuario.teste@email.com',
      senha: 'senha123'
    };

    const response = await request(baseURL)
      .post('/logins')
      .set('Content-Type', 'application/json')
      .send(loginData)
      .expect(200);

      token = response.body.access_token;
  });

  it('GET / - Lista todos os produtos sem o token', async () => {
    const response = await request(baseURL)
      .get('/products')
      .set('Content-Type', 'application/json')
      .expect(401);
    
    expect(response.body.message).toBe('Acesso negado. Nenhum token fornecido.');
  });

  it('GET / - Lista todos os produtos com o token', async () => {
    const response = await request(baseURL)
      .get('/products')
      .set('Content-Type', 'application/json')
      .set('access-token', token)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('POST / - Cria um novo produto', async () => {
    const productData = {
      nome: 'Caneta Esferográfica',
      tipo: 'material-de-consumo',
      quantidade: 100,
      categoria: 'material-de-escritorio',
      descricao: 'Caneta esferográfica azul para escritório'
    };

    const response = await request(baseURL)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set('access-token', token)
      .send(productData)
      .expect(201);

    expect(response.body.nome).toBe(productData.nome);
    expect(response.body.quantidade).toBe(productData.quantidade);
    idProduto = response.body._id
  });

  it('DELETE /:id - Tenta deletar um produto inexistente', async () => {
    const productIdInvalido = '60adf9b60fcb9100157db1ff';

    const response = await request(baseURL)
      .delete(`/products/${productIdInvalido}`)
      .set('Content-Type', 'application/json')
      .set('access-token', token)
      .expect(404);

    expect(response.body.message).toBe('Produto não encontrado');
  });
});
