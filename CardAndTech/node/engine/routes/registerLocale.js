//Bibliotecas
const bdRoomR = require('../accessBd/roomBd');
const bdLocaleR = require('../accessBd/localeBd');
const bdConfR = require('../accessBd/confBd');
const bdRoom = new bdRoomR();
const bdLocale = new bdLocaleR();
const bdconf = new bdConfR();

module.exports = class registerPlayer{

    constructor(){};

    //Verifica o id do Locale
    checkIdLocale(locale){
        return new Promise((resolve,reject)=>{
            //Add Locale ao 'locale.bd'
            return bdLocale.addLocale(locale)
            .then(()=>{
                //Pega o Id do locale
                bdLocale.checkLocale(locale)
                .then(resolve)
            }).catch(()=>{
                //Pega o Id do locale
                bdLocale.checkLocale(locale)
                .then(resolve)
            })
        });
    }

    checkRoom(room, pwd){
        return new Promise((resolve,reject)=>{
            const nameSpace = {}
            nameSpace.room = room;
            nameSpace.pwd = pwd;
            bdRoom.chekRoom(room)
            .then( (idRoom) =>{
                nameSpace.idRoom = idRoom;
                //Verifica o id da Room
                return bdRoom.chekPwd(idRoom, pwd)
            },() =>{//Catch
                //Erro na Room
                reject("Nome da sala está errado")})
            .then( resolve, () =>{//Resposta chekPwd
                //Erro na senha da Room
                reject("Senha incorreta")
            })
        });
            
    }
    //Cadastro Na sala
    registerLocale(req,args){
        return new Promise((resolve,reject)=>{
            const nameSpace = {}
            //Verifica se dados da Sala estao corretos
            this.checkRoom(args.room, args.pwd)
            .then((idRoom)=>{
                nameSpace.idRoom = idRoom;
                //Pega o id do Locale
                return this.checkIdLocale(args.locale)
            },reject)
            .then((idLocale)=>{
                nameSpace.idLocale = idLocale;
                //Associa Locale a Room
                return bdconf.addLocale(nameSpace.idRoom, nameSpace.idLocale)
            },reject)
            .then(resolve,reject);
        });
    };
}

