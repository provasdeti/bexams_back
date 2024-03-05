import 'dotenv/config';
//console.log(process.env);

import "reflect-metadata";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { appDataSource } from './config/database';

const app = express();

app.use(cors({
    origin: '*',
    allowedHeaders: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(routes); // Rotas definidas em routes.ts

app.listen(5000, () => {
    console.log("Rodando na porta 5000...");
});

appDataSource.initialize()
    .then(() => {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao conectar com o banco de dados:", error);
});