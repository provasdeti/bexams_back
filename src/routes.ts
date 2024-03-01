import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { appDataSource } from './config/database'; // Importe sua fonte de dados
import Usuario from './app/models/User';
import Imagem from './app/models/Image';

const router = Router();

router.post('/users', async (req, res) => {
  // Supondo que os dados do usuário são enviados no corpo da requisição
  const { nome, email } = req.body;

  try {
    // Crie uma nova instância de usuário
    const usuario = new Usuario();
    usuario.nome = nome;
    usuario.email = email;

    // Obtenha o repositório de usuário e salve o novo usuário
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const novoUsuario = await usuarioRepository.save(usuario);

    // Se tudo ocorrer bem, envie de volta os dados do usuário inserido
    res.json(novoUsuario);
  } catch (error) {
    if (error instanceof Error) {
      // Agora está seguro para ler error.message
      res.status(500).json({ message: error.message });
    } else {
      // Se não for uma instância de Error, lidar de outra forma
      res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  }
});

router.post('/images', multer(multerConfig).single('file'), async (req, res) => {
  // Verifique se um arquivo foi enviado com sucesso
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo foi enviado." });
  }

  // Supondo que os dados do usuário são enviados no corpo da requisição
  const { originalname: name, size, filename: key } = req.file;

  try {
    // Crie uma nova instância de usuário
    const imagem = new Imagem();
    imagem.name = name;
    imagem.size = size;
    imagem.key = key;
    imagem.url = '';
    imagem.created_at = new Date();

    // Obtenha o repositório de usuário e salve o novo usuário
    const imagemRepository = appDataSource.getRepository(Imagem);
    const novaImagem = await imagemRepository.save(imagem);

    // Se tudo ocorrer bem, envie de volta os dados do usuário inserido
    res.json(novaImagem);
  } catch (error) {
    if (error instanceof Error) {
      // Agora está seguro para ler error.message
      res.status(500).json({ message: error.message });
    } else {
      // Se não for uma instância de Error, lidar de outra forma
      res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  }
});

router.post('/postinho', multer(multerConfig).single('file'), async (req, res) => {
  console.log(req.file)
  res.json({ 'hello': 'Hello World Jason!' });
});

router.get('/json', (req, res) => {
  res.json({ 'hello': 'Hello World Jason!' });
});

router.get('/oi', (req, res) => {
  res.send('Bem-vindo ao Oi!');
});

router.get('/', (req, res) => {
  res.send('Bem-vindo ao Backendo da API!');
});

export default router;