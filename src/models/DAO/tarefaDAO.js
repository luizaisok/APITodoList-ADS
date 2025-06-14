const { createConnection } = require('./db');

async function getTarefas() {
  const connection = await createConnection(); // se estiver usando createConnection do db.js
  const [rows] = await connection.query("SELECT * FROM tarefa");
  return rows;
}


async function insertTarefa(id, titulo, descricao, data_vencimento, status){
    if(titulo, descricao, data_vencimento, status){
        const result = await connection.query(`
            INSERT INTO tarefa (titulo, descricao, data_vencimento, status)
            VALUES($1, $2, $3, $4)
            RETURNING id, titulo, descricao, data_vencimento, status`,
            [titulo, descricao, data_vencimento, status]
        );
        return true;
    }
    console.error("Falha ao criar a tarefa. Faltou algum dado");
    return false;
};

function editTarefa(id, titulo, descricao, data_vencimento, status){
    if(id, titulo, descricao, data_vencimento, status){
        console.log(`Editando a tarefa de ID: ${id} -> Título: ${titulo} - Descrição ${descricao} - Data de Vencimento: ${data_vencimento} - Status: ${status}`);
        return true;
    }
    console.error("Falha ao editar a tarefa. Faltou algum dado");
    return false;
};

function deleteTarefa(id){
    if(id){
        console.log(`Removendo a tarefa de ID: ${id}`);
        return true;
    }
    console.error("Falha ao deletar a tarefa");
    return false;
};

module.exports = {
    getTarefas,
    insertTarefa,
    editTarefa,
    deleteTarefa
};