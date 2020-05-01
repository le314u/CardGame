//Bibliotecas
const bdRoomR = require('../accessBd/roomBd');
const bdRoom = new bdRoomR();

module.exports = class registerPlayer{

    constructor(){};

    registerRoom(req,args){
        return new Promise((resolve,reject)=>{
            bdRoom.chekRoom(args.name)
            .then(()=>{
                reject("Sala ja existente!")
            }).catch(()=>{
                return bdRoom.addRoom(args.name, args.pwd)
            }).then((arg)=>{
                resolve(arg)
            }).catch(()=>{
                reject("Falha ao add Sala!")
            })
        });
    };
}