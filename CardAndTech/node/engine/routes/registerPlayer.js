//Bibliotecas
const loadFileR = require('./loadPage');
const bdPlayerR = require('../accessBd/playerBd');

//Bibliotecas
const loadFile = new loadFileR();
const bdPlayer = new bdPlayerR();

module.exports = class registerPlayer{

    constructor(){
    };
    
    //Add Ip e Name no Bd
    registerPlayer(req, args){
        return new Promise((resolve,reject)=>{
            let ip = (request)=>{return request.connection.remoteAddress}
            bdPlayer.addPlayer(ip(req), args.name)
            .then((arg)=>{
                if(arg == false){
                    reject("Falha ao registrar Player!")
                } else {
                    resolve(arg)
                }
            }).catch((arg)=>{
                reject("Ip ja cadastrado!")
            })
        });
    }
}