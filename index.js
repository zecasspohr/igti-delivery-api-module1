import express from "express";
import pedidosRouter from "./pedidosRouter.js";

const app = express();
app.use(express.json());

app.use('/pedidos', pedidosRouter);

app.listen(3000, () => {
    console.log('Iniciou!');
});