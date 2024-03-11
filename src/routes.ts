import { Router } from 'express';
import { MulterRequest } from './config/multer'; 
import multerConfig from './config/multer';
import multer from 'multer';
import { appDataSource } from './config/database'; // Importe sua fonte de dados
import Usuario from './app/models/User';

// Ele chamou o model de Post
import Imagem from './app/models/Image';

const router = Router();
const userRepository = appDataSource.getRepository(Usuario);
const imagemRepository = appDataSource.getRepository(Imagem);

router.post('/users', async (req, res) => {
  // Desctructuring para evitar repetição de req.body...
  const { nome, email } = req.body;

  try {
    // Crie uma nova instância de usuário
    const usuario = new Usuario();
    usuario.nome = nome;
    usuario.email = email;

    // Salvar o novo usuário no banco de dados
    const novoUsuario = await userRepository.save(usuario);

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
  if (!multerReq.file) {
    return res.status(400).json({ message: "Nenhum arquivo foi enviado." });
  }

  // Determinar dinamicamente os valores com base no tipo de armazenamento
  const storageType = process.env.STORAGE_TYPE || 'local'; // Assumindo que 'local' é o padrão
  let name, size, key, url;

  // Desctructuring com base no tipo de armazenamento
  if (storageType === 's3') {
    ({ originalname: name, size, key, location: url } = multerReq.file);
  } else {
    // Para armazenamento local
    ({ originalname: name, size, filename: key, name: url } = multerReq.file);
  }

  console.log('#### >', name, ' ', size, ' ', key, ' ', url);

  try {
    // Crie uma nova instância de imagem e salve no banco de dados
    const imagem = new Imagem();
    imagem.name = name;
    imagem.size = size;
    imagem.key = key!.replace(/^img\//, '');;
    imagem.url = url!;
    console.log(imagem);

    const novaImagem = await imagemRepository.save(imagem);

    // Envie de volta os dados da imagem inserida
    res.json(novaImagem);
  } catch (error) {
    // Tratamento de erro
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  }
});

router.get('/images', async (req, res) => {
  try {
    const imagens = await imagemRepository.find();
    return res.json(imagens);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  }
});

router.delete('/images/:name/:id', async (req, res) => {
  const {id, name} = req.params;
  
  try {
    const imagem = await imagemRepository.findOneBy({ id: id, name });

    if (!imagem) {
      return res.status(404).json({ message: "Imagem não encontrada." });
    }
    
    await imagemRepository.remove(imagem);
    return res.status(200).json({message: 'Sucesso!'});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  }
});

router.get('/json', (req, res) => {
  res.json({ 'hello': 'Hello World Jason!' });
});

router.get('/oi', (req, res) => {
  res.send('Bem-vindo ao Oi!');
});

export default router;