const request = require('supertest');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const baseURL = 'http://localhost:4000/api';

describe('API REST de Produtos', () => {
  let token;

  beforeAll(() => {
    // Simula a criação de um token JWT para testes
    const payload = { userId: '1234567890' }; // ID fictício para testes
    token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  });

  it('GET / - Lista todos os produtos sem o token', async () => {
    const response = await request(baseURL)
      .get('/products')
      .set('Content-Type', 'application/json')
      .expect(401);
    
    expect(response.body.message).toBe('Token de autenticação não fornecido');
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

  it('PUT / - Atualiza um produto existente', async () => {
    // ID fictício de produto para testes
    const productId = '60adf9b60fcb9100157db1fa'; 
    const updateData = {
      _id: productId,
      nome: 'Caneta Esferográfica Vermelha',
      quantidade: 50
    };

    const response = await request(baseURL)
      .put('/products')
      .set('Content-Type', 'application/json')
      .set('access-token', token)
      .send(updateData)
      .expect(202);

    expect(response.body.nome).toBe(updateData.nome);
    expect(response.body.quantidade).toBe(updateData.quantidade);
  });

  it('PUT /aprove/:id - Atualiza o status de um produto', async () => {
    // ID fictício de produto para testes
    const productId = '60adf9b60fcb9100157db1fa';
    const statusUpdate = {
      status: 'Aprovado'
    };

    const response = await request(baseURL)
      .put(`/products/aprove/${productId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', token)
      .send(statusUpdate)
      .expect(200);

    expect(response.body.product.status).toBe(statusUpdate.status);
  });
});

describe('API REST de Login e Cadastro', () => {
    it('POST /cadastro - Cadastro de novo usuário comum', async () => {
      const userData = {
        nome: 'Usuario Teste',
        email: 'usuario.teste@email.com',
        senha: 'senha123'
      };
  
      const response = await request(baseURL)
        .post('/cadastro')
        .set('Content-Type', 'application/json')
        .send(userData)
        .expect(201);
  
      expect(response.body.email).toBe(userData.email);
      expect(response.body.nome).toBe(userData.nome);
    });
  
    it('POST /cadastro - Tentativa de cadastro de administrador (apenas para teste)', async () => {
      const adminData = {
        nome: 'Administrador Teste',
        email: 'admin.teste@admin.com',
        senha: 'admin123'
      };
  
      const response = await request(baseURL)
        .post('/cadastro')
        .set('Content-Type', 'application/json')
        .send(adminData)
        .expect(201);
  
      expect(response.body.email).toBe(adminData.email);
      expect(response.body.nome).toBe(adminData.nome);
    });
  
    it('POST / - Login de um usuário comum', async () => {
      const loginData = {
        email: 'usuario.teste@email.com',
        senha: 'senha123'
      };
  
      const response = await request(baseURL)
        .post('/')
        .set('Content-Type', 'application/json')
        .send(loginData)
        .expect(200);
  
      expect(response.body).toHaveProperty('token');
    });
  
    it('POST / - Tentativa de login de administrador (apenas para teste)', async () => {
      const loginData = {
        email: 'admin.teste@admin.com',
        senha: 'admin123'
      };
  
      const response = await request(baseURL)
        .post('/')
        .set('Content-Type', 'application/json')
        .send(loginData)
        .expect(200);
  
      expect(response.body).toHaveProperty('token');
    });
  
    it('POST / - Tentativa de login com credenciais inválidas', async () => {
      const invalidLoginData = {
        email: 'usuario.inexistente@email.com',
        senha: 'senhaerrada'
      };
  
      const response = await request(baseURL)
        .post('/')
        .set('Content-Type', 'application/json')
        .send(invalidLoginData)
        .expect(401);
  
      expect(response.body.message).toBe('Credenciais inválidas');
    });
  });