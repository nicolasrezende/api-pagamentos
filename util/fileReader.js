var fs = require('fs');

var now = new Date;
var arquivo = now + " - " + process.argv[2];
fs.readFile('nodejs_logo_green.jpg', function(error, buffer){
    console.log('arquivo lido');
    fs.writeFile(arquivo, buffer, function(erro){
        console.log('arquivo escrito');
    });
});
