//Bibliotecas
const bdRoomR = require('../accessBd/roomBd');
const bdRoom = new bdRoomR();
const bdPlayerR = require('../accessBd/playerBd');
const bdPlayer = new bdPlayerR();
const bdConfR = require('../accessBd/confBd');
const bdconf = new bdConfR();

module.exports = class registerPlayer{

    constructor(){};

    //Converte iP do player em iD 
    ipToId(ip){
        return bdPlayer.checkIp(ip);
    }

    //Verifica em qual o iD da sala onde o Player se encontra
    inRoom(idPlayer){
        return bdconf.searchRoomWithPlayer(idPlayer)
    }

    //Verifico se a Senha esta Correta
    checkRoom(nameRoom, pwd){
        return bdRoom.chekRoom(nameRoom).then((idRoom)=>{
            return bdRoom.chekPwd(idRoom, pwd)
        })
    }

    //Cadastro Na sala
    leaveRoom(req,args){
        const nameSpace = {};
        return new Promise((resolve,reject)=>{
            //Pega o Ip do request
            let ip = (request)=>{return request.connection.remoteAddress}

            //Pega o Id do Ip
            this.ipToId(ip(req))
            .then((idPlayer)=>{
                //Verifica se iDplayer ja esta em alguma Sala
                nameSpace.idPlayer = idPlayer;
                return this.inRoom(idPlayer)
            },()=>{
                reject("Ip invalido")
            }).then(()=>{//Resposta do inRoom
                return bdconf.rmPlayerRoom(nameSpace.idPlayer)
                .then(resolve)
                .catch(reject)
            },()=>{                
                reject("Ip não está associado a nenhuma sala")
            })
        });
    };
}

