var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

console.log('Executando Thread');

if (cluster.isMaster) {
    console.log('Executando thread master');
    cpus.forEach(function() {
        cluster.fork();
    })

    cluster.on('listening', function(worker) {
        console.log('cluster conectado ' + worker.process.pid);
    });

    cluster.on('disconnect', worker => {
        console.log('cluster %d desconectado', worker.process.pid);
        cluster.fork();
    });

} else {
    console.log('Executando thread slave');
    require('./index');
}
