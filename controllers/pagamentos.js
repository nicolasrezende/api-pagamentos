var logger = require('../servicos/logger');

module.exports = function(app) {

    const PAGAMENTO_CRIADO = 'CRIADO';
    const PAGAMENTO_CONFIRMADO = 'CONFIRMADO';
    const PAGAMENTO_CANCELADO = 'CANCELADO';

    var pagamentosController = {};

    pagamentosController.buscarPorId = function(req, res) {
        var id = req.params.id;

        console.log('consultando pagamento ' + id);
        //PROCURANDO EM CACHE
        /*var cache = app.servicos.memcachedClient();
        cache.get('pagamento-' + id, function(err, data) {
            if (err || !data) {
                console.log('MISS - chave nao encontrada');
            } else {
                console.log('HIT - valor: ' + JSON.stringify(retorno));
                res.json(retorno);
                return;
            }
        });*/
        var connection = app.persistencia.connectionFactory();
        var PagamentosDAO = new app.persistencia.PagamentosDAO(connection);

        PagamentosDAO.buscarPorId(id, function(erro, resultado) {

            if (erro) {
                console.log(erro);
                logger.error("Erro ao consultar por id: " + id + erro);
                res.status(500).send(erro);
                return;
            }
            logger.info('consultando pagamento ' + id);
            console.log('pagamento encontrado : ' + JSON.stringify(resultado));
            res.send(resultado);
            return;
        });
    };

    pagamentosController.cancelarPagamento = function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        var connection = app.persistencia.connectionFactory();
        var PagamentosDAO = new app.persistencia.PagamentosDAO(connection);

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        PagamentosDAO.atualizar(pagamento, function(erro) {
            if (erro) {
                console.log(erro);
                logger.error("Erro ao atualizar DELETAR pagamento id: " + id + erro);
                res.status(500).send(erro);
                return;
            }
            console.log(pagamento);
            res.status(204).json(pagamento);
        });
    };

    pagamentosController.confirmarPagamento = function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        var connection = app.persistencia.connectionFactory();
        var PagamentosDAO = new app.persistencia.PagamentosDAO(connection);

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

        PagamentosDAO.atualizar(pagamento, function(erro) {
            if (erro) {
                console.log(erro);
                logger.error("Erro ao atualizar ATUALIZAR pagamento id: " + id + erro);
                res.status(500).send(erro);
                return;
            }
            //PEGANDO PEGAMENTO DO CACHE
            /*var cache = app.servicos.memcachedClient();
            cache.get('pagamento-' + id, 100000, function(exception, retorno) {
                if (exception || !retorno) {
                    console.log('MISS - chave não encontrada');
                    return;
                } else {
                    //INSERINDO NO CACHE
                    cache.set('pagamento-' + id, retorno, 100000, function(err) {
                        console.log('HISS - nova chave: pagamento-' + pagamento.id);
                    });
                }
            });*/
            var response = {
                pagamento: pagamento,
                links: [{
                        href: "http:localhost:3000/pagamentos/pagamentos/" + pagamento.id,
                        rel: "consultar",
                        method: "GET"
                    },
                    {
                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        rel: "cancelar",
                        method: "DELETE"
                    }
                ]
            }

            res.send(response);
        });
    };

    pagamentosController.inserirPagamento = function(req, res) {
        req.assert('pagamento.forma_pagamento', 'Preencha o campo forma de pagamento').notEmpty();
        req.assert('pagamento.valor', 'Preencha o campo corretamente').notEmpty().isFloat();

        var erros = req.validationErrors();

        if (erros) {
            console.log(JSON.stringify(erros));
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body["pagamento"];
        console.log('Processando requisicao de um novo pagamento');
        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var PagamentosDAO = new app.persistencia.PagamentosDAO(connection);
        PagamentosDAO.salvar(pagamento, function(erro, resultado) {
            if (erro) {
                console.log(erro);
                logger.error("Erro ao atualizar INSERIR pagamento id: " + id + erro);
                res.status(500).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                var responsePagamento = {
                    forma_pagamento: pagamento,
                    links: [{
                            href: "http:localhost:3000/pagamentos/pagamentos/" + pagamento.id,
                            rel: "consultar",
                            method: "GET"
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "confirmar",
                            method: "PUT"
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "cancelar",
                            method: "DELETE"
                        }
                    ]
                };
                //INSERINDO NO CACHE
                var cache = app.servicos.memcachedClient();
                cache.set('pagamento-' + pagamento.id, pagamento, 100000, function(err) {
                    console.log('nova chave: pagamento-' + pagamento.id);
                });
                if (pagamento.forma_pagamento == 'cartao') {
                    var cartao = req.body['cartao'];
                    console.log(cartao);

                    var CartaoClient = new app.servicos.CartoesClient();
                    CartaoClient.autoriza(cartao, function(exception, request, response, retorno) {
                        if (exception) {
                            console.log(exception);
                            res.status(400).send(exception);
                            return;
                        }
                        console.log(retorno);
                        responsePagamento.cartao = retorno;
                        res.location('/pagamentos/pagamento/' + pagamento.id);
                        res.status(201).json(responsePagamento);
                    });
                } else {
                    console.log('pagamento criado');
                    res.location('/pagamentos/pagamento/' + pagamento.id);
                    res.status(201).json(responsePagamento);
                }
            }
        });
    };

    return pagamentosController;
}
