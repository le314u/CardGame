//Bibliotecas
const url = require('url');
const rHash = require('../routes/routeHash')
const routeHash = new rHash()

module.exports= class Route{

    constructor(){
        this.relativePath = __dirname + "/../../front"
    };

    //verifica a rota apartir da requisição
    extractRoute(require){
        let path = resource(require.url)
        return path;
    }

    //Extrai o recurso da Url
    resource(fullUrl){
        //Pega o caminho da URL ou seja a string que vem após a porta e antes das querys
        //protocolo://domínio:porta/RECURSO/.../RECURSO?query_string#fragmento
        let parsedUrl = url.parse(fullUrl).pathname
        return parsedUrl
    };

    //Redireciona de acordo com a rota
    redirect(requisicao, data){
        return new Promise((resolve,reject)=>{
            //Verifica se requisição é GET ou POST
            if(requisicao.method === 'GET'){
                //Se GET retorna a pagina
                resolve(routeHash.static(requisicao.url))
            } else if (requisicao.method === 'POST'){
                //Se POST faz o processamento
                let objHash = this.resource(requisicao.url)
                routeHash[objHash](requisicao, data)
                .then((arg)=>{
                    resolve(arg)
                }).catch((arg)=>{resolve(arg)})
            } else {
                resolve("Tipo de requisição não implementada")
            }
        });
    };

    resource(fullUrl){
        //Pega o caminho da URL ou seja a string que vem após a porta e antes das querys
        //protocolo://domínio:porta/RECURSO/.../RECURSO?query_string#fragmento
        let parsedUrl = url.parse(fullUrl).pathname
        if(parsedUrl[0] == '/'){
            return parsedUrl.substring(1)
        } else {
            return parsedUrl
        }
        
    };

}
