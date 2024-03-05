import { Router } from 'express';
import { MulterRequest } from './config/multer'; 
import multerConfig from './config/multer';
import multer from 'multer';
import { appDataSource } from './config/database'; // Importe sua fonte de dados
import Usuario from './app/models/User';
import Imagem from './app/models/Image';

const router = Router();

router.post('/users', async (req, res) => {
  // Desctructuring para evitar repetição de req.body...
  const { nome, email } = req.body;

  try {
    // Crie uma nova instância de usuário
    const usuario = new Usuario();
    usuario.nome = nome;
    usuario.email = email;

    // Salvar o novo usuário no banco de dados
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const novoUsuario = await usuarioRepository.save(usuario);

    // Envie de volta os dados do usuário inserido.
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
  const multerReq = req as MulterRequest;
  // Verifique se um arquivo foi enviado com sucesso
  if (multerReq.file) {
    console.log(multerReq.file);
  }  else
  return res.status(400).json({ message: "Nenhum arquivo foi enviado." });

  // Desctructuring para evitar repetição de req.file...
  const { originalname: name, size, key, location: url } = multerReq.file

  try {
    // Crie uma nova instância de usuário
    const imagem = new Imagem();
    imagem.name = name;
    imagem.size = size;
    imagem.key = key!;  
    imagem.url = url!;
    
    // Salvar a nova imagem no banco de dados.
    const imagemRepository = appDataSource.getRepository(Imagem);
    const novaImagem = await imagemRepository.save(imagem);

    // Envie de volta os dados da imagem inserida.
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