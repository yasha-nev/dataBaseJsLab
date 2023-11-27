var fs = require("fs");
var http = require("http");
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

var db = mongoClient.connect(url);

async function getStudent(){
    let result = await mongoClient.connect();
    let db = result.db("studentdb");
    let collection = db.collection('student');
    let response = await collection.find({}).toArray();
    
    return response
}

async function getStudentByName(nm){
    let result = await mongoClient.connect();
    let db = result.db("studentdb");
    let collection = db.collection('student');
    let response = await collection.find({name: nm}).toArray();
    
    return response
}


http.createServer(async function (request, response) {
    var str = request.url.split('=');
    
    switch(str[0]) { 
        case "/":
            var fileStream = fs.createReadStream("./demo.html", "UTF-8");
            response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            fileStream.pipe(response);
            break;
        case "/style.css":
            var fileStream = fs.createReadStream("./style.css", "UTF-8");
            response.writeHead(200, {"Content-Type": "text/css"});
            fileStream.pipe(response);
            break;
        case "/demo.js":
            var fileStream = fs.createReadStream("./demo.js", "UTF-8");
            response.writeHead(200, {"Content-Type": "text/js"});
            fileStream.pipe(response);
            break;

        case "/?fname":
            var all = []
            switch(str[1]){
                case "all":
                    arr = await getStudent();
                    response.write(JSON.stringify(arr));
                    response.end();
                    break;

                default:
                    arr = await getStudentByName(str[1])

                    response.write(JSON.stringify(arr));
                    response.end()
                    break;
            }
            break;

        default:
            response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"}); 
            response.write("<!DOCTYPE html>\n" +
                "<html>\n" +
                " <head>\n" +
                " <meta charset='utf-8'>\n" + 
                " </head>\n" +
                " <body>\n"
                );
            
            response.write("404, NOT FOUND: " + request.url); 
            response.end(" </body>\n" +
                    "</html>\n");
        }

}).listen(3000);

console.log("Server running at http://localhost:3000/");


