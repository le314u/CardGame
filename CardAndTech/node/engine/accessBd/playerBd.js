const db = require('./mgrSql3')

const TABLE = {}; // A global constant
TABLE.nameTable = 'player';
TABLE.id = 'id_user';
TABLE.ip = 'ip';
TABLE.name = 'name';
Object.freeze(TABLE)

module.exports = class Player{
    constructor(){
        this.dbManager = new db();
        this.table = this.dbManager.openDb('player.db')
        this.init = false;
        this.initPromise = this.initDb().then(()=>{
            this.init = true;
        }).catch(()=>{
            console.log("Tabela player ja existente ")
        });
        
    };
    initDb(){
        //Inicia um novo BD caso o arquivo.bd esteja corrompido
        return this.dbManager.comandDb(this.table,`
        CREATE TABLE ${TABLE.nameTable} (
            ${TABLE.id} INTEGER PRIMARY KEY,
            ${TABLE.ip} TEXT NOT NULL UNIQUE,
            ${TABLE.name} TEXT NOT NULL UNIQUE
        );`);
    };
    addPlayer(ip, name){         
        //Add o player ao Bd  
        return new Promise((resolve, reject)=>{
            this.whichId(ip, name)//Procura o Player no Bd
            .then(()=>{
                reject(false);
            })
            .catch(()=>{
                //Adiciona apenas se o player não existe
                let code = `INSERT INTO ${TABLE.nameTable} (${TABLE.ip}, ${TABLE.name}) VALUES ('${ip}','${name}');`
                this.dbManager.comandDb(this.table, code)
                .then(()=>{
                    resolve(true);
                })
                .catch(()=>{
                    reject(false)
                });
                
            })
        });
        
    };
    rmPlayer(ip, name){
        //Pega o id de acordo com o ip e o nome
        return new Promise((resolve, reject)=>{
            this.whichId(ip, name)
            .then((id)=>{
                //Remove apenas se o player existe
                let code = `DELETE FROM ${TABLE.nameTable} WHERE ${TABLE.id} = '${id}';`
                this.dbManager.comandDb(this.table, code);
                reject(true);
            })
            .catch(()=>{
                resolve(false);
            })
        });
    };
    whichIp(name){
        //Pega o ip de acordo com o name
        return new Promise((resolve, reject)=>{
            let strCode = `SELECT ${TABLE.ip} FROM ${TABLE.nameTable} WHERE ${TABLE.name} = "${name}";`
            this.dbManager.searchDb(this.table, strCode).then((player)=>{
                if(player === undefined){
                    reject(false)
                } else {
                    console.log("Dentro do Search "+player.ip)
                    resolve(player[TABLE.ip]);
                }
            })
            .catch(reject);
        });
    };
    whichIdWithName(name){
        //Pega o ip de acordo com o name
        return new Promise((resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.name} = "${name}";`
            this.dbManager.searchDb(this.table, strCode).then((player)=>{
                if(player === undefined){
                    reject(false)
                } else {
                    resolve(player[TABLE.id]);
                }
            })
            .catch(reject);
        });
    };
    whichId(ip, name){
        //retorna o id no BD de acordo com ip e name
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.name} = "${name}" AND ${TABLE.ip} = "${ip}";`
            this.dbManager.searchDb(this.table, strCode)
            .then((inst)=>{
                if(inst === undefined){
                    reject(false);
                } else {
                    resolve(inst[TABLE.id]);
                }
            }).catch(reject);
        });
    };
    checkIp(ip){
        //Pega o id de acordo com o name
        return new Promise((resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.ip} = "${ip}";`
            this.dbManager.searchDb(this.table, strCode).then((player)=>{
                if(player === undefined){
                    reject(false)
                } else {
                    resolve(player[TABLE.id]);
                }
            })
            .catch(reject);
        });
    };
}


