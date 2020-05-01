const registerPlayerR = require('./registerPlayer');
const registerRoomR = require('./registerRoom');
const enterRoomR = require('./enterRoom');
const leaveRoomR = require('./leaveRoom');
const gActionR = require('./getAction');
const loadPageR = require('./loadPage')
const erroR = require('./error')

// const loadPage = new loadPageR()
// const registerPlayer = new registerPlayerR()
        

module.exports = class RouteHash{
    constructor(){
        this.loadPage = new loadPageR()
        this.rPlayer = new registerPlayerR()
        this.rRoom = new registerRoomR()
        this.eRoom = new enterRoomR()
        this.lRoom = new leaveRoomR()
        this.gAction = new gActionR()
        this.error = new erroR()
        
    };
    
    registerPlayer(req, args){
        return new Promise( (resolve, __)=>{
            this.rPlayer.registerPlayer(req, args)
            .then((arg)=>{
                let pageError = this.error.creatMsg(arg,'registerPlayer')
                resolve(pageError)
            }).catch((arg)=>{
                let pageError = this.error.creatMsg(arg,'registerPlayer')
                resolve(pageError)
            })
        });
    };
    registerRoom(req, args){
        return new Promise( (resolve, __)=>{
            this.rRoom.registerRoom(req, args)
            .then((arg)=>{
                let pageError = this.error.creatMsg(arg,'RegisterRoom')
                resolve(pageError)
            }).catch((arg)=>{
                let pageError = this.error.creatMsg(arg,'RegisterRoom')
                resolve(pageError)
            })
        });
    };
    enterRoom(req, args){
        return new Promise( (resolve, __)=>{
            this.eRoom.enterRoom(req, args)
            .then((arg)=>{
                let pageError = this.error.creatMsg(arg,'enterRoom')
                resolve(pageError)
            }).catch((arg)=>{
                let pageError = this.error.creatMsg(arg,'enterRoom')
                resolve(pageError)
            })
        });
    };
    leaveRoom(req, args){
        return new Promise( (resolve, __)=>{
            this.lRoom.leaveRoom(req, args)
            .then((arg)=>{
                let pageError = this.error.creatMsg(arg,'leaveRoom')
                resolve(pageError)
            }).catch((arg)=>{
                let pageError = this.error.creatMsg(arg,'leaveRoom')
                resolve(pageError)
            })
        });
    };

    getAction(req, args){
        return new Promise( (resolve, __)=>{
            this.gAction.getAction(req, args)
            .then((arg)=>{
                let pageError = this.error.creatMsg(arg,'leaveRoom')
                resolve(pageError)
            }).catch((arg)=>{
                let pageError = this.error.creatMsg(arg,'leaveRoom')
                resolve(pageError)
            })
        });
    };
    
    nextSession(req, args){};
    
    
    errorMsg(msgError){
        return `[routeHash] Mensagem de erro: ${msgError}`
    };

    //Redireciona de acordo com a rota
    static(fullUrl){
        //Extrai o recurso da url
        let pathResource = this.loadPage.resource(fullUrl)
        //Verifica se o resource é um 'caminho' reservado let reserved = this.loadPage.specific(pathResource)
        let reserved = false;
        //Faz a rota
        if(reserved === false){
            //caso típico
            let pathFile = this.loadPage.pathPage(pathResource);
            if( this.loadPage.fileExists(pathFile) ){
                let page = this.loadPage.loadHtml(pathFile)
                return page;
            } else {
                //erro de rota
                let pathFile = this.loadPage.pathPage("/index")
                let page = this.loadPage.loadHtml(pathFile)
                return page;
            }
        } else {
            //caso atípico
            return "URL RESERVADA"
        } 
    };
}