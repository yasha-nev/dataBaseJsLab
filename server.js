var fs = require("fs");
var http = require("http");
var cassandra = require('cassandra-driver');

const contactPoints = ['127.0.0.1'];
const localDataCenter = 'datacenter1';
const keyspace = 'mykeyspace';

const client = new cassandra.Client({ contactPoints, localDataCenter, keyspace });

http.createServer(function (request, response) {
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
            switch(str[1]){
                case "all":
                    var query = 'SELECT * FROM student';
                    client.execute(query, function (err, result) { 
                        arr = getStudentFromDb(err, result)
                        response.write(JSON.stringify(arr));
                        response.end()
                    });
                    break;
                default:
                    arr = []
                    var name = str[1];
                    var query = "SELECT * FROM student WHERE name = ?"
                    const params = [name];
                    client.execute(query, params, { prepare: true }, function (err, result) {
                        arr = getStudentFromDb(err, result)
                        response.write(JSON.stringify(arr));
                        response.end()
                    });
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


function getStudentFromDb(err, result){
    arr = []
    if (!err){
        for (let i of result){
            student = {
                name: i.name,
                grp: i.grp
            }
            arr.push(student);
        }
    } else {
        student = {
            name: 'no',
            grp: 'no'
        }
        arr.push(student);
    }

    return arr;
}