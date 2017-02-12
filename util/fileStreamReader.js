var fs = require('fs');

fs.createReadStream('nodejs_logo_green.jpg')
    .pipe(fs.createWriteStream('imagem-com-stream.jpg'))
    .on('finish', function() {
        console.log('arquivo escrito com stream');
    });
