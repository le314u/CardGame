const qs = require('querystring');
const fs = require('fs')

module.exports= class Error{

    constructor(){
        this.relativePath = __dirname + "/../../front";
        this.pathTemplate = this.relativePath+'/erroMsg'
        this.template = 'Erro Ao carregar template msg de Erro';
        this.template = fs.readFileSync(this.pathTemplate, 'utf-8',function(err,data){});
    };

    creatMsg(msg, route){
        let link = this.createLink(route);
        let newData = this.template;
        newData = this.replaceRoute(newData, route);
        newData = this.replaceLink(newData, link);
        newData = this.replaceMsg(newData, msg);
        return newData;
    }

    createLink(route){
        return '/'+route
    }
    
    replaceRoute(newData, route){
        return newData.replace(/\${Route}/g, route)
    }

    replaceLink(newData, link){
        return newData.replace(/\${Link_Texto_Route}/g, link)
    }

    replaceMsg(newData, msg){
        return newData.replace(/\${MensagemDeErro}/g, msg)
    }

}