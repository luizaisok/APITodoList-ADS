/*
[x] 1. Inicialização do Projeto NPM
[x] 2. Criar um novo projeto npm, configurar o package.json e instalar as dependências: express, body-parser, ejs.
[x] 3. Configuração Inicial do Express
[x] 4. Criar o servidor Express, configurar a porta, middlewares, body-parser e EJS.
[x] 5. Implementação do CRUD
[x] 6. Implementar as rotas GET, POST, PUT e DELETE para manipulação de uma entidade (a ser escolhida).
[ ] 7. Utilizar um array em memória ou arquivos JSON para simular o banco de dados.
[x] 8. Estruturação em MVC
[x] 9. Dividir o projeto em pastas: models, views, controllers, e routes, organizando a lógica conforme o padrão.
[ ] 10. Criação das Rotas HTML e da API REST
[ ] 11. Criar páginas EJS para listar, criar, editar e excluir itens (interface).
[ ] 12. Criar rotas REST (JSON) para as mesmas operações (API paralela).
*/

const express = require("express"); // Passo 2
const bodyParser = require("body-parser"); // Passo 2
const app = express();
exports.app = app;

app.use(bodyParser.json()); // Usado para converter os dados recebidos em json
app.use(bodyParser.urlencoded({extended: true})); // Mesmo que venha por html, vai converter para json

app.set("view engine", "ejs"); // Passo 2
app.set("views", "./src/views");

const methodOverride = require('method-override');
app.use(methodOverride('_method')); // Formulário suporta PUT

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const { getTarefas, insertTarefa, editTarefa, deleteTarefa } = require("../models/DAO/tarefaDAO");
// const { createConnection } = require("../models/DAO/db"); 
// createConnection(); // Para testar. Deve aparecer Conectado ao MySQL!

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Rota tipo GET
app.get("/", (req, res) => {
    res.status(200).send("Bem vindo(a) ao * ToDo-List *");
})

// READ
app.get("/tarefas", async (req, res) => {
    const tarefas = await getTarefas();

    // console.log("Tarefas ", tarefas); 
    res.render("listatarefas", {tarefasDoController: tarefas});
})

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Literalmente a  API para enviar os dados das tarefas
app.get("/api/tarefas", async (req, res) => {
    const tarefas = await getTarefas();
    res.status(200).json({success: true, tarefas});
}) // status(200) é o status do HTTP 200 que significa Bem sucessido

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// CREATE - Mostrar o formulário de cadastro
app.get("/criartarefa", (req, res) => {
    res.render("formtarefa", {tarefa: {}});
})

// CREATE - Recebendo os dados do cadastro
app.post("/tarefa", async (req, res) => {
    const {titulo, descricao, data_vencimento, status} = req.body;
    const result = await insertTarefa(titulo, descricao, data_vencimento, status);
 
    if(result){ // result é boolean 
        return res.status(201).send("Tarefa criada com sucesso!");
    }
    return res.status(404).send("Não foi possível criar a tarefa :(");
})  // status(201) é o status do HTTP 201 que significa Criado
    // status(404) é o status do HTTP 404 que significa Não encontrado
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Inserindo tarefa via API (?)
app.post("/api/tarefa", async (req, res) => {
    const {titulo, descricao, data_vencimento, status} = req.body;
    const result = await insertTarefa(titulo, descricao, data_vencimento, status);

    if(result){
        return res.status(202).json({success: true});
    }
    return res.status(404).json({success: false});
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// UPDATE - Mostrar o formulário de edição
app.get("/editartarefa/:id", async (req, res) => {
    const codTarefa = req.params.id;
    const tarefas = await getTarefas();
    const tarefa = tarefas[codTarefa - 1];

    res.status(200).render("formtarefa", {tarefa});
});

// UPDATE - Recebendo os dados do edição
app.put("/tarefa/:id", async (req, res) => {
    const id = req.params.id; 
    const {titulo, descricao, data_vencimento, status} = req.body;
    const result = await editTarefa(id, titulo, descricao, data_vencimento, status);

    if(result){
        return res.status(200).send("Tarefa atualizada com sucesso!");
    }
    return res.status(404).send("Não foi possível editar o cliente");
});

// API para editar tarefa
app.put("/tarefa", async (req, res) => {
    const {id, titulo, descricao, data_vencimento, status} = req.body;
    const result = await editTarefa(id, titulo, descricao, data_vencimento, status);
    if(result){
        return res.status(200).json({success: true});
    }
    return res.status(404).json({success: false});
})

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DELETE
app.delete("/tarefa/:id", async (req, res) => {
    const { id } = req.params;
    const result = await deleteTarefa(id);

    if (result) {
        return res.redirect("/tarefas");
    }
    return res.status(404).send("Não foi possível remover a tarefa");
});

app.delete("/api/tarefa", async (req, res) => {
    const [id] = req.body;
    const result = await deleteTarefa(id);
    if(result){
        return res.status(200).json({success: true});
    }
    return res.status(404).json({success: false});
})

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

app.listen(3000, 'localhost', () => {
    console.log("Servidor rodando na porta 3000");
})