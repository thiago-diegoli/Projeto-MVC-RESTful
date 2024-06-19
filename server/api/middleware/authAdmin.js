import jwt from 'jsonwebtoken';
import User from '../models/LoginModel.js';

const authAdmin = (req, res, next) => {
  const token = req.header('access-token')
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    User.findById(req.user.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.cargo !== 'admin') {
          return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
        }

        next()
      })
      .catch(err => {
        res.status(500).json({ message: 'Erro ao buscar informações do usuário.', error: err.message });
      })
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

export default authAdmin;