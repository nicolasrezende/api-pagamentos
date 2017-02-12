function PagamentosDAO(connection) {
    this._connection = connection;
}

PagamentosDAO.prototype.salvar = function(pagamento, callback) {
    this._connection.query('INSERT INTO pagamento SET ? ', pagamento, callback);
};

PagamentosDAO.prototype.atualizar = function(pagamento, callback) {
    this._connection.query('UPDATE pagamento SET status = ? WHERE id = ?', [pagamento.status, pagamento.id], callback);
};

PagamentosDAO.prototype.listar = function(callback) {
    this._connection.query('SELECT * FROM pagamento', callback);
};

PagamentosDAO.prototype.buscarPorId = function(id, callback) {
    this._connection.query('SELECT * FROM pagamento WHERE id = ?', [id], callback);
};

module.exports = function() {
    return PagamentosDAO;
}
