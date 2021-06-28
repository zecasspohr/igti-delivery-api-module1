import express from "express";
import pedidos from './pedidos.js'

const router = express.Router();

router.post('/', async (req, res) => {
    let pedido = req.body;

    pedido = await pedidos.inserir({
        cliente: pedido.cliente,
        produto: pedido.produto,
        valor: pedido.valor
    });

    res.send(pedido);
});

router.put('/', async (req, res) => {
    let pedido = req.body;
    pedido = await pedidos.atualizar({
        id: pedido.id,
        cliente: pedido.cliente,
        produto: pedido.produto,
        valor: pedido.valor,
        entregue: pedido.entregue
    });
    res.send(pedido);
});

router.patch('/entregue', async (req, res) => {
    let pedido = req.body;
    pedido = await pedidos.atualizar({
        id: pedido.id,
        entregue: pedido.entregue
    });
    res.send(pedido);
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await pedidos.excluir(id);
    res.end();
});

router.get(/maisVendidos/, async (req, res) => {
    const produtos = await pedidos.produtosMaisVendidos();
    res.send(produtos);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = await pedidos.retorna(id);
    res.send(pedido);
});

router.get('/totalCliente/:cliente', async (req, res) => {
    const cliente = req.params.cliente;
    const total = await pedidos.totalCliente(cliente);
    res.send({total});
});

router.get('/totalProduto/:produto', async (req, res) => {
    try {
        const produto = req.params.produto;
        const total = await pedidos.totalProduto(produto);
        res.send({total});
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});


export default router