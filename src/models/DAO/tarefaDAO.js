const { createConnection } = require('./db');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- READ
async function getTarefas() {
  const connection = await createConnection(); // se estiver usando createConnection do db.js
  const [rows] = await connection.query("SELECT * FROM tarefa");
  return rows;
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- INSERT
async function insertTarefa(titulo, descricao, data_vencimento, status){
    const connection = await createConnection(); 
    if(titulo && descricao && data_vencimento && status){
        const [result] = await connection.query(
            `INSERT INTO tarefa (titulo, descricao, data_vencimento, status)
             VALUES (?, ?, ?, ?)`,
            [titulo, descricao, data_vencimento, status]
        );

        // console.log("Resultado do insert: ", result); // Só pra confirmar no console

        if(result.affectedRows > 0){
            return true;
        }
        return false;
    }
    console.error("Falha ao criar a tarefa. Faltou algum dado");
    return false; 
};
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- UPDATE
async function editTarefa(id, titulo, descricao, data_vencimento, status) {
    const connection = await createConnection();
    if (id && titulo && descricao && data_vencimento && status) {
        const [result] = await connection.query(
            `UPDATE tarefa SET titulo = ?, descricao = ?, data_vencimento = ?, status = ? WHERE id = ?`,
            [titulo, descricao, data_vencimento, status, id]
        );

        if (result.affectedRows === 0) return false;
        return true;
    }

    console.error("Falha ao editar a tarefa. Faltou algum dado");
    return false;
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- DELETE
async function deleteTarefa(id) {
    if (id) {
        const connection = await createConnection();
        const [result] = await connection.query(
            `DELETE FROM tarefa WHERE id = ?`,
            [id]
        );

        if (result.affectedRows > 0) {
            console.log(`Tarefa de ID ${id} removida com sucesso.`);
            return true;
        }

        console.error(`Nenhuma tarefa encontrada com ID ${id}.`);
        return false;
    }

    console.error("Falha ao deletar a tarefa. ID não informado.");
    return false;
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Exportar
module.exports = {
    getTarefas,
    insertTarefa,
    editTarefa,
    deleteTarefa
};