import { Router } from 'express';
// Importe seus controladores aqui, por exemplo:
// import userController from './controllers/userController';

const router = Router();

// Definindo uma rota GET simples
router.get('/', (req, res) => {
  res.send('Bem-vindo ao Backendo da API!');
});

// Exemplo de rota para um recurso de usuário
// router.get('/users', userController.listAll);
// router.post('/users', userController.create);
// router.get('/users/:id', userController.findById);
// router.put('/users/:id', userController.update);
// router.delete('/users/:id', userController.delete);

export default router;