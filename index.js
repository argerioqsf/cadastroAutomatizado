var admin = require('firebase-admin');
var fs = require('fs');

var serviceAccount = require('./firebase/credenciais/app-meta-d0e38-firebase-adminsdk-0o41a-89b134451c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://app-meta-d0e38.firebaseio.com'
});

var db = admin.database();
var ref = db.ref("config/modulos_user").once("value",modulos=>{
    ReadCsv(modulos.val());
});

/*ref.once("value", snapshot=>{
  console.log("func_perfil: ",snapshot.val());
});

var read_stream = fs.createReadStream('./public/csv/Alunos.csv', {encoding: 'utf8'});
read_stream.on("data", function(data){
    console.log("data.",data);
});
read_stream.on("error", function(err){
    console.error("An error occurred: %s", err);
});
read_stream.on("close", function(data){
    console.log("File closed.");
});
*/

 function ReadCsv(modulos){
    fs.readFile('./public/csv/Alunos.csv', function(err,data){
        if(err) {
            console.error("Could not open file: %s", err);
            process.exit(1);
        }
        //console.log(data);
        //console.log(data.toString('utf8'));
        csvJSON(data.toString('utf8'),modulos).then(csvJson=>{
            console.log("CscJson[0]: ",csvJson[0]);
            console.log("CscJson: ",csvJson);
            let user = [];
            for (let i = 0; i < csvJson.length; i++) {
                console.log("csvJson["+i+"]: ",csvJson[i]);
                db.ref("user_perfil/"+csvJson[i].matricula).set(csvJson[i]).then(()=>{ 
                    
                });
            }
        });
    });
 }

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

function csvJSON(csv,modulos){
 return new Promise((resolve,reject)=>{
    var lines=csv.split("\r\n");
    var result = [];
    var headers=lines[0].split(",");
    headers = headers.map(function(h) {
        return h.trim();
    });
    for(var i=1;i<lines.length-1;i++){
        let obj = [];
        var currentline=lines[i].split(",");
        currentline = currentline.map(function(h) {
            return h.trim();
        });
        for(var j=0;j<headers.length;j++){
            if(currentline[j] != undefined && currentline[j] != "-"){
                obj[headers[j]] = currentline[j];
            }else{
                obj[headers[j]] = "";
            }
        }
        console.log("obj: ",obj);
        obj.imagem = "assets/images/newUser-b.png";
        obj.imagemuid = generateUUID();
        obj.perfil = "user";
        obj.modulos = modulos;
        result.push(obj);
        let temp = result;
        console.log("result: ",temp);
    }
    //return result; //JavaScript object
    resolve(result); //JSON
 });
}