var fs = require('fs');

module.exports = function(app) {
    var controllerUpload = {};

    controllerUpload.uploadImagem = function(req, res) {
        var arquivo = req.headers.filename;
        console.log('arquivo recebido: ' + arquivo);

        req.pipe(fs.createWriteStream("files/" + arquivo))
            .on('finish', function() {
                console.log('arquivo escrito');
                res.status(201).send('OK');
            });
    };

    return controllerUpload;
}
