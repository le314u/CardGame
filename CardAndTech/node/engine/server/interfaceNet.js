const os = require('os');//Os
const INTERRFACE = 'e' //'[w]ireless ou [e]thernet'
//Pegando uma tabela de Ip
getTableIp = function getTableIp(){
    let ips = new Object();//Objeto de retorno
    var interfaces = os.networkInterfaces();//Objeto com todas as interfaces de rede
    Object.keys(interfaces).forEach( function(keyInterface){
      var count = 0;
      var interface = interfaces[keyInterface];
      interface.forEach( function(arch){
        //Verifica se usa o protocolo ipv4 e não é o localhost(loopback)
        if ('IPv4' === arch['family'] && arch['internal'] === false) {
          //Adiciona o < interface:[ip,..,ip] > a uma tabela Hash
          if(count == 0){
            ips[keyInterface] = [arch['address']]
            count++
          }
          else{
            ips[keyInterface].push(arch['address']);
            count++
          }
        }
      });
    });
    return ips
}
  
//pega apenas o ip Wifi da tabela de ips 
ipListWifi = function ipListWifi(ipTable){
    //OBS ipTable = { interface:[ip,..,ip], ..., interface:[ip,..,ip]}
    let ipList = [] // Objeto retorno
    Object.keys(ipTable).forEach( function(interface){//Para toda interface
      ipsInterface = ipTable[interface]
      if(interface[0] == INTERRFACE){//Verifica se a interface é '[w]ireless ou [e]thernet'
        ipsInterface.forEach( function(ip){
          ipList.push(ip)
        })
      }
    });
    return ipList
}

module.exports.whichIp = function whichIp(){
    return ipListWifi(getTableIp())
}