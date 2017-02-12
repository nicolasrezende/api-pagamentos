var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expresValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger');

module.exports = function() {
    var app = express();

    //a cada request o morgan vai intercepitar e vai utilizar o formato commom do apache
    //e escrever no log a informação da request via stream com winstom
    app.use(morgan('common', {
        stream: {
            write: function(mensagem) {
                logger.info(mensagem);
            }
        }
    }));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(expresValidator());

    consign().
    include('controllers').
    then('routes').
    then('persistencia').
    then('servicos').
    into(app);

    return app;
}

/*
  Vantagens do express
  isolar o código de tratamento das urls
  isolar a escrita de html com a lógica da aplicação
  enviar conteudos em diferentes formatos, dependendo da informação do request
  trabalhar com envios de dados, com os métdos GET e POST
*/
