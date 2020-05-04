//Bibliotecas
const bdRoomR = require('../accessBd/roomBd');
const bdRoom = new bdRoomR();
const bdPlayerR = require('../accessBd/playerBd');
const bdPlayer = new bdPlayerR();
const bdConfR = require('../accessBd/confBd');
const bdConf = new bdConfR();
const bdLocaleR = require('../accessBd/localeBd');
const bdLocale = new bdLocaleR();

const NOT_DEF = "Not Define"

module.exports = class registerPlayer{

    constructor(){};
    //Converte iP do player em iD 
    ipToId(ip){
        return bdPlayer.checkIp(ip);
    }

    //Verifica qual o iD da sala onde o Player se encontra
    inRoom(idPlayer){
        return bdConf.searchRoomWithPlayer(idPlayer)
    }

    //totalPlayerk
    var(ip){
        return new Promise((resolve,reject)=>{
            const nameSpace = {};
            //Pega o Id do Ip
            this.ipToId(ip)
            .then((idPlayer)=>{
                //Verifica se iDplayer ja esta em alguma Sala
                nameSpace.idPlayer = idPlayer;
                return this.inRoom(idPlayer)
            },()=>{
                reject("Ip invalido")
            }).then((idRoom)=>{
                nameSpace.idRoom = idRoom;

                resolve(nameSpace);
            },()=>{                
                //Resposta do inRoom
                reject("Jogador não esta associado a uma sala")
            })
        });
    };

    //totalPlayer
    totalPlayerWithMe(idRoom){
        return bdConf.totalPlayersRoom(idRoom)
    };

    //Seleciona um Player
    selectNumberUntil(maxNumber){
        return Math.trunc(Math.random()*1000)% maxNumber + 1
    };

    //Verifica se foi setado a ação
    checkAction(idRoom, idPlayer){
        return new Promise((resolve,reject)=>{
            bdConf.getAction(idRoom, idPlayer)
            .then((isntancia)=>{
                if(isntancia.action == NOT_DEF){
                    reject(false);
                } else {
                    resolve(isntancia.action);
                }
            },()=>{                
                //Resposta do inRoom
                reject("Erro na Query")
            })
        });
    };

    //Reseta as Ações de Todos da Sala
    resetAction(idRoom){
        return bdConf.setAction(idRoom, NOT_DEF);
    };

    //Seta a Mesma ação para Todos da Sala
    setAction(idRoom, action){
        return bdConf.setAction(idRoom, action);
    };

    //Seta um espião na sala
    setSpy(idRoom, idSpy){
        return bdConf.setSpy(idRoom, idSpy);
    };

    //Seta Ação e Espião
    setActionInRoom(nameSpace){
        //Caso a sala não tem ação
        return bdConf.totalLocalesRoom(nameSpace.idRoom)
        .then( (numberLocales)=>{
            nameSpace.numberLocales = numberLocales;
            //Escolhe um novo Lugar
            return bdConf.getLocalesRoom(nameSpace.idRoom)
        }).then( (idLocales) => {
            //Pega um numero de 1 até total de Locales
            let nLocale = this.selectNumberUntil(nameSpace.numberLocales);
            //Pega o id do locale 'nLocale' 
            let idLocal = idLocales[nLocale]['id_locale']
            //Seta o Novo Lugar
            return bdConf.setAction(nameSpace.idRoom, idLocal)
        }).then( ()=>{
            //Pega um numero de 1 até total de Player
            let idPlayer = this.selectNumberUntil(nameSpace.numberLocales);
            //Seta o Espião
            return bdConf.setSpy(nameSpace.idRoom, idPlayer)
        })
    }

    //retorna Ação
    reset(req, args){
        return new Promise ((resolve,reject) => {
            let nameSpace = {}
            //Pega o Ip do request
            let ip = (request)=>{return request.connection.remoteAddress}
            this.var(ip(req))
            .then( (nameSpaceVar)=>{
                //Seta variavel Global para usar em todo o Codigo
                nameSpace = nameSpaceVar;
                return this.checkAction(nameSpace.idRoom, nameSpace.idPlayer)
            })
            .then( ()=>{
                //Tem ação
                return bdConf.getAction(nameSpace.idRoom, nameSpace.idPlayer)
            }).then((idAction)=>{
                if(idAction.action == 0){
                    this.resetAction.then(resolve,reject)
                    resolve("Espião");
                } else {
                    reject("So o Espião pode resetar a sala")
                }
            })
            .catch(()=>{
                //Caso a sala não tem ação
                reject("Sala ainda não há atribuição de ação")
            })
        })
    };

    






    //Cadastro Na sala
    /*getAction(req, args){
        return new Promise ((resolve,reject) => {
            //Pega o Ip do request
            let ip = (request)=>{return request.connection.remoteAddress}
            this.var(ip(req))
            .then( (nameSpace)=>{
                this.checkAction(nameSpace.idRoom, nameSpace.idPlayer)
                .then( ()=>{//Tem ação
                    return bdConf.getAction(nameSpace.idRoom, nameSpace.idPlayer).then((idAction)=>{
                        if(idAction.action == 0){
                            resolve("Espião");
                        } else {
                            bdLocale.checkLocaleById(idAction.action)
                            .then( (local)=>{
                                resolve(local);
                            });
                        }
                    })
                },()=>{//Não tem ação
                    bdConf.totalLocalesRoom(nameSpace.idRoom)
                    .then( (numberLocales)=>{
                        //Escolhe um novo Lugar
                        bdConf.getLocalesRoom(nameSpace.idRoom)
                        .then( (idLocales) => {
                            //Pega um numero de 1 até total de Locales
                            let nLocale = this.selectNumberUntil(numberLocales);
                            //Pega o id do locale 'nLocale' 
                            let idLocal = idLocales[nLocale]['id_locale']
                            //Seta o Novo Lugar
                            bdConf.setAction(nameSpace.idRoom, idLocal).then( ()=>{
                                //Pega um numero de 1 até total de Player
                                let idPlayer = this.selectNumberUntil(numberLocales);
                                //Seta o Espião
                                bdConf.setSpy(nameSpace.idRoom, idPlayer).then( ()=>{
                                    resolve(this.getAction(req, args))
                                });
                            });                        
                        })
                    })
                })
            })
        })
    };*/
}