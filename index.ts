import express from 'express';
import cors from 'cors';
import routes from './routes'; 

const app = express();

app.use(cors({
    origin: '*',
    allowedHeaders: '*'
}));

app.use(express.json());
app.use(routes); // Rotas definidas em routes.ts

app.listen(5000, () => {
    console.log("Rodando na porta 5000...");
});
