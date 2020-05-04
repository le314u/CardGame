const db = require('./mgrSql3')

const TABLE = {}; // A global constant
TABLE.nameTable = 'room';
TABLE.id = 'id_room';
TABLE.alias = 'alias';
TABLE.pwd = 'pwd';
Object.freeze(TABLE)

module.exports = class Room{
    constructor(){
        this.dbManager = new db();
        this.table = this.dbManager.openDb('room.db')
        this.init = false;
        this.initPromise = this.initDb().then(()=>{
            this.init = true;
        }).catch(()=>{
            //console.log("Tabela room ja existente ")
        });
    };
    initDb(){
        return this.dbManager.comandDb(this.table, `
        CREATE TABLE ${TABLE.nameTable} (
            ${TABLE.id} INTEGER PRIMARY KEY,
            ${TABLE.alias} TEXT NOT NULL UNIQUE,
            ${TABLE.pwd} TEXT
        );`)
    }
    addRoom(name, pwd){
        return new Promise( (resolve, reject)=>{
            this.chekRoom(name)
            .then((id)=>{
                reject(false)
            })
            .catch(()=>{
                let strCode = `INSERT INTO ${TABLE.nameTable} ( ${TABLE.alias}, ${TABLE.pwd}) VALUES( "${name}", "${pwd}" );`
                this.dbManager.comandDb(this.table, strCode)
                .then(resolve)
                .catch(reject)
            })
        });
    }
    rmRoom(name, pwd){
        return new Promise( (resolve, reject)=>{
            this.chekRoom(name).then((id)=>{
                this.chekPwd(id, pwd)
                .then((idRoom)=>{
                    let strCode = `DELETE FROM ${TABLE.nameTable} WHERE ${TABLE.id} = "${idRoom}";`
                    this.dbManager.comandDb(this.table, strCode)
                    .then(resolve)
                    .catch(reject)
                })
                .catch(reject)
            })
            
        });
    }
    shiftPwd(id , pwd){
        return new Promise( (resolve, reject)=>{
            let strCode = `UPDATE${TABLE.nameTable} SET ${TABLE.pwd} = "${pwd}" WHERE ${TABLE.id} = "${id}";`
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject);
        });
    }
    chekPwd(id, pwd){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.id} = ${id} AND ${TABLE.pwd} = '${pwd}' ;`
            this.dbManager.searchDb(this.table, strCode)
            .then((inst)=>{
                if(inst === undefined){
                    reject(false);
                } else {
                    resolve(inst[TABLE.id]);
            }})
            .catch(reject);
        });
    }
    chekRoom(name){
        //Retorna o id de acordo com o nome
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.alias} = "${name}";`
            this.dbManager.searchDb(this.table, strCode)
            .then((inst)=>{
                if(inst === undefined){
                    reject(false);
                } else {
                    resolve(inst[TABLE.id]);
            }})
            .catch(reject);
        })
    }
}
