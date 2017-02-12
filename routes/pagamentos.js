module.exports = function(app) {

    var controller = app.controllers.pagamentos;

    app.get('/pagamentos', function(req, res) {
        res.send('OK');
    });

    app.get('/pagamentos/pagamento/:id', controller.buscarPorId);

    app.delete('/pagamentos/pagamento/:id', controller.cancelarPagamento);

    app.put('/pagamentos/pagamento/:id', controller.confirmarPagamento);

    app.post('/pagamentos/pagamento', controller.inserirPagamento);
}
