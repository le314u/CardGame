const db = require('./mgrSql3')
const playerR = require('./playerBd')
const dbPlayer = new playerR()


const TABLE1 = {}; // Jogadores
TABLE1.nameTable = 'sessionsPlayers';
TABLE1.id1 = 'id_user';
TABLE1.id2 = 'id_room';
TABLE1.action = 'action';
TABLE1.ref1 = 'user'
TABLE1.ref2 = 'room'
Object.freeze(TABLE1)

const TABLE2 = {}; // Locais
TABLE2.nameTable = 'sessionsLocale';
TABLE2.id1 = 'id_room';
TABLE2.id2 = 'id_locale';
TABLE2.qtd = 'qtdOccurs';
TABLE2.ref1 = 'room'
TABLE2.ref2 = 'locale'
Object.freeze(TABLE2)

module.exports = class Conf{
    constructor(){
        this.dbManager = new db();
        this.init = false;
        this.table = this.dbManager.openDb('conf.db')
        this.initPromise = this.initDb1()
        .then(()=>{
            this.initDb2().then(()=>{
                this.init = true;
            }).catch(()=>{
                //console.log("Tabela conf ja existente ")
            });
        }).catch(()=>{
            //console.log("Tabela conf ja existente ")
        });
    };
    initDb1(){
        return this.dbManager.comandDb(this.table, `
        CREATE TABLE ${TABLE1.nameTable}(
            ${TABLE1.id1} INTEGER,
            ${TABLE1.id2} INTEGER,
            ${TABLE1.action} TEXT NOT NULL,
            PRIMARY KEY (${TABLE1.id1}, ${TABLE1.id2}),
            FOREIGN KEY (${TABLE1.id1}) 
            REFERENCES ${TABLE1.ref1} (${TABLE1.id1}) 
                ON DELETE CASCADE 
                ON UPDATE NO ACTION,
            FOREIGN KEY (${TABLE1.id2}) 
            REFERENCES ${TABLE1.ref2} (${TABLE1.id2}) 
                ON DELETE CASCADE 
                ON UPDATE NO ACTION
        );`)
    }
    initDb2(){
        return this.dbManager.comandDb(this.table, `
        CREATE TABLE ${TABLE2.nameTable}(
            ${TABLE2.id1} INTEGER,
            ${TABLE2.id2} INTEGER,
            qtdOccurs INTEGER NOT NULL,
            PRIMARY KEY (${TABLE2.id1}, ${TABLE2.id2}),
            FOREIGN KEY (${TABLE2.id1}) 
            REFERENCES ${TABLE2.ref1} (${TABLE2.id1}) 
                ON DELETE CASCADE 
                ON UPDATE NO ACTION,
            FOREIGN KEY (${TABLE2.id2}) 
            REFERENCES ${TABLE2.ref2} (${TABLE2.id2}) 
                ON DELETE CASCADE 
                ON UPDATE NO ACTION
        );`)
    };
    searchRoomWithPlayer(idPlayer){
        return new Promise((resolve, reject)=>{
            //Seleciona id da Sala onde o Player está
            let strCode = `SELECT ${TABLE1.id2} FROM ${TABLE1.nameTable} WHERE ${TABLE1.id1} = ${idPlayer};`
            this.dbManager.searchDb(this.table, strCode)
            .then((idRoom)=>{
                if(idRoom === undefined){
                    reject(false)
                } else {
                    resolve(idRoom[TABLE1.id2]);
                }
            })
            .catch(reject);
        });
    };
    addPlayerRoom(idPlayer, idRoom){
        return new Promise( (resolve, reject)=>{
            let strCode = `INSERT INTO ${TABLE1.nameTable} ( ${TABLE1.id1}, ${TABLE1.id2}, ${TABLE1.action}) VALUES( ${idPlayer}, ${idRoom}, "Not Define" );`
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    rmPlayerRoom(idPlayer){
        return new Promise( (resolve, reject)=>{
            let strCode = `DELETE FROM ${TABLE1.nameTable} WHERE ${TABLE1.id2} = ${idPlayer};`
            console.log(strCode)
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    getPlayersInRoom(idRoom){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT * FROM ${TABLE1.nameTable} WHERE ${TABLE1.id2} = ${idRoom} ;`
            this.dbManager.searchies(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    totalPlayersRoom(idRoom){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE1.id1} FROM ${TABLE1.nameTable} WHERE ${TABLE1.id2} = ${idRoom} ;`
            this.dbManager.searchies(this.table, strCode)
            .then((rows)=>{
                resolve(rows.length);
            })
            .catch(reject)
        })
    };
    totalLocalesRoom(idRoom){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE2.id2} FROM ${TABLE2.nameTable} WHERE ${TABLE1.id2} = ${idRoom} ;`
            this.dbManager.searchies(this.table, strCode)
            .then((rows)=>{
                resolve(rows.length);
            })
            .catch(reject)
        })
    };
    setAction(idRoom, action){
        return new Promise( (resolve, reject)=>{
            let strCode = `UPDATE ${TABLE1.nameTable} SET ${TABLE1.action} = "${action}"  WHERE ${TABLE1.id2} = ${idRoom} ;`
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    setSpy(idRoom, idPlayer){
        return new Promise( (resolve, reject)=>{
            let strCode = `UPDATE ${TABLE1.nameTable} SET ${TABLE1.action} = "0"  WHERE ${TABLE1.id2} = ${idRoom} AND ${TABLE1.id1} = ${idPlayer} ;`
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    getAction(idRoom, idPlayer){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE1.action} FROM ${TABLE1.nameTable} WHERE ${TABLE1.id1} = ${idPlayer} AND ${TABLE1.id2} = ${idRoom} ;`
            this.dbManager.searchDb (this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };
    getLocalesRoom(idRoom){
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE2.id2} FROM ${TABLE2.nameTable} WHERE ${TABLE2.id1} = ${idRoom} ;`
            this.dbManager.searchies (this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    };

    
    addLocale(idRoom, idLocale){
        return new Promise( (resolve, reject)=>{
            let strCode = `INSERT INTO ${TABLE2.nameTable} ( ${TABLE2.id1}, ${TABLE2.id2}, ${TABLE2.qtd}) VALUES( ${idRoom}, ${idLocale}, 0);`
            this.dbManager.comandDb(this.table, strCode)
            .then(resolve)
            .catch(reject)
        })
    }

    rmLocale(room, locale){}
    initGame(){}
    nextGame(){}
    enterRoom(player, room){}
    whichAction(player){}
}
