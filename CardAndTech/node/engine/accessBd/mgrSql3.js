const path = require('path');
const sqlite3 = require("sqlite3");
const dirDbs = __dirname+'/../../db/'
debug = false
module.exports = class Db{
    constructor(){};
    openDb(name){
        return new sqlite3.Database( dirDbs+name, (err) => {
            if (err) {
                console.error('Erro Criação:'+err.message);
            }else{
                //console.log('Conexao estabelecida com ' + name);
            }
        });
    };
    closeDb(dataBase){
        return new Promise((resolve, reject)=>{
            return dataBase.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(false);
                }else{
                    console.log('Fecha a Conexão com o banco de dados');
                    resolve(true);
                }
            });
        });
    };
    comandDb(dataBase, strCode){
        if(debug){console.log(strCode)}
        return new Promise((resolve, reject)=>{
            return dataBase.run(strCode,(err) => {
                //console.log(code)
                if (err) {
                    //console.error('Erro comando:'+err.message);
                    reject(false);
                }
                resolve(true);
            })
        });
    };
    searchDb(dataBase, strCode, callBack){
        if(debug){console.log(strCode)}
        return new Promise((resolve, reject)=>{
            return dataBase.get(strCode,(err, instRow) => {
                if (err) {
                    console.error('Erro pesquisas:'+err.message);
                    reject(err.message)
                }
                resolve(instRow);
            });
        });
    };
    searchies(dataBase, strCode, callBack){
        if(debug){console.log(strCode)}
        return new Promise((resolve, reject)=>{
            dataBase.all(strCode,(err, instRows) => {
                if (err) {
                    console.error('Erro pesquisas:'+err.message);
                    reject(err.message)
                }
                resolve(instRows);
            });
        });
    };
};