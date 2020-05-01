//Bibliotecas
const fs = require('fs');
const url = require('url');
    
module.exports= class LoadPage{

    constructor(){
        this.relativePath = __dirname + "/../../front"
    };

    //Extrai o recurso da Url
    resource(fullUrl){
        //Pega o caminho da URL ou seja a string que vem após a porta e antes das querys
        //protocolo://domínio:porta/RECURSO/.../RECURSO?query_string#fragmento
        let parsedUrl = url.parse(fullUrl).pathname
        return parsedUrl
    };


    loadHtml(pathPage){
        if(this.fileExists(pathPage)){
            let pageHtml = fs.readFileSync(pathPage,'utf8', function(err, data){
                return retorno
            })
            return pageHtml
        } else {
            return "Pagina não encontrada"
        }
    }

    //Retorna o caminho absoluto da pagina referente ao recurso
    pathPage(resource){
        return this.relativePath + resource + ".html";
    };
    
    //Verifica se filePath realmente aponta para um arquivo
    fileExists(filePath){
        try{
            return fs.statSync(filePath).isFile();
        }catch (err){
            return false;
        }
    };
}