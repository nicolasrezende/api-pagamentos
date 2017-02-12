module.exports = function(app) {

    var controller = app.controllers.correios;
    app.post('/correios/calculo-prazo', controller.calculaPrazo);
}
