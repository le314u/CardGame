//Bibliotecas
const http = require('http');//Servidor http
const qs = require('querystring');
const {whichIp} = require('./interfaceNet')//Pega o ip Lan Wifi
const route = require('./route')//Redirecionamento das requisições

//Constantes
const hostname = whichIp()[0] // Pega o ip automaticamente
const port = 8080;

//Route
let rota = new route()

//Cria um servidor Http Geral
const server = http.createServer((req, res) => {
    //Cria uma resposta text/html
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    //Pega os Dados
    dataPOST(req).then((data)=>{
        //Faz a rota
        rota.redirect(req, data)
        .then((pageHtml)=>{//responde a requisição
            //certificando que a resposta vai estar em texto
            pageHtml = pageHtml.toString()
            res.end(pageHtml)
        })
    })
});

server.listen(port, hostname, () => {
    console.log('Acesse e compartilhe o link via whats')
    console.log(`https://web.whatsapp.com/send?text=http://${hostname}:${port}/`)
    console.log()
    console.log(`Para jogar acesse http://${hostname}:${port}/`);
    console.log()

});

function dataPOST(req){
    return new Promise((resolve,reject)=>{
        var body='';
        if(req.method == 'POST') {
            req.on('data', function (chunk) {
                body +=chunk;
            });
            req.on('end',function(){
                var data =  qs.parse(body);
                resolve(data)
            });
        } else if(req.method == 'GET') {
            resolve(body)
        }
    });
}

