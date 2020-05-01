const db = require('./mgrSql3')

const TABLE = {}; // A global constant
TABLE.nameTable = 'locale';
TABLE.id = 'id_local';
TABLE.local = 'local';
Object.freeze(TABLE)

module.exports = class Conf{
    constructor(){
        this.dbManager = new db();
        this.table = this.dbManager.openDb('locale.db')
        this.init = false;
        this.initPromise = this.initDb().then(()=>{
            this.init = true;
        }).catch(()=>{
            console.log("Tabela locale ja existente ")
        });
    };
    initDb(){
        return this.dbManager.comandDb(this.table, `
        CREATE TABLE ${TABLE.nameTable} (
            ${TABLE.id} INTEGER PRIMARY KEY,
            ${TABLE.local} TEXT NOT NULL UNIQUE
        );
        `)
    }
    addLocale(locale){
        return new Promise( (resolve, reject)=>{
            this.checkLocale(locale).then(()=>{
                reject(false)
            }).catch(()=>{
                let strCode = `INSERT INTO ${TABLE.nameTable} (${TABLE.local}) VALUES ("${locale}");`
                this.dbManager.comandDb(this.table, strCode)
                .then(resolve)
                .catch(reject)
            });
        });
    };
    rmLocale(locale){
        return new Promise( (resolve, reject)=>{
            this.checkLocale(locale).then((id)=>{
                let strCode = `DELETE FROM ${TABLE.nameTable} WHERE ${TABLE.id} = "${id}";`
                this.dbManager.comandDb(this.table, strCode)
                .then(resolve)
                .catch(reject);
            });
        });
    };
    checkLocale(locale){
        //Retorna o id de acordo com o nome
        return new Promise( (resolve, reject)=>{
            let strCode = `SELECT ${TABLE.id} FROM ${TABLE.nameTable} WHERE ${TABLE.local} = "${locale}";`
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