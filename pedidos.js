import { promises as fs } from "fs"

const { readFile, writeFile } = fs;

async function loadData() {
    const data = await readFile('pedidos.json');
    return JSON.parse(data);
}

async function writeData(data) {
    await writeFile("pedidos.json", JSON.stringify(data, null, 2));
}

async function inserir(novoPedido) {
    const data = await loadData();

    novoPedido.entregue = false;
    novoPedido.timestamp = new Date().toISOString();

    novoPedido = { id: data.nextId++, ...novoPedido };

    data.pedidos.push(novoPedido);

    await writeData(data);

    return novoPedido;
}

async function atualizar(pedido) {
    const data = await loadData();
    const index = data.pedidos.findIndex((ped) => ped.id === pedido.id);
    if (index < 0) {
        throw new Error('Pedido não encontrado!');
    }
    data.pedidos[index] = { ...data.pedidos[index], ...pedido };

    await writeData(data);

    return data.pedidos[index];
}

async function excluir(id) {
    const data = await loadData();

    data.pedidos = data.pedidos.filter((ped) => ped.id !== id);

    await writeData(data);
}

async function retorna(id) {
    const data = await loadData();

    const pedido = data.pedidos.find((ped) => ped.id === id);

    return pedido;
}

async function totalCliente(cliente) {
    const data = await loadData();
    const total = data.pedidos.reduce((total, pedido) => {
        if (pedido.cliente === cliente && pedido.entregue) {
            return total + pedido.valor;
        }
        return total;
    }, 0);
    return total;
}
async function totalProduto(produto) {
    const data = await loadData();
    const total = data.pedidos.reduce((total, pedido) => {
        if (pedido.produto === produto && pedido.entregue) {
            return total + pedido.valor;
        }
        return total;
    }, 0);
    return total;
}
async function produtosMaisVendidos() {
    const data = await loadData();

    const jsonProdutos = data.pedidos.map((pedido) => {
        return pedido.produto;
    }).reduce((total, produto) => {
        if (!total[produto]) {
            total[produto] = 0;
        }
        total[produto]++;
        return total;
    }, {});

    let produtos = [];
    for (let produto in jsonProdutos) {
        produtos.push({ produto, qtde: jsonProdutos[produto] });
    }

    produtos = produtos.sort((a, b) => b.qtde - a.qtde);
    produtos = produtos.map((prod) => { return `${prod.produto} - ${prod.qtde}` });

    return produtos;
}

export default { inserir, atualizar, excluir, retorna, totalCliente, totalProduto, produtosMaisVendidos }
//console.log(await produtosMaisVendidos());