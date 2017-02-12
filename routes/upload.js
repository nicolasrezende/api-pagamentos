module.exports = function(app) {

    var controller = app.controllers.upload;
    app.post('/upload/imagem', controller.uploadImagem);
};
