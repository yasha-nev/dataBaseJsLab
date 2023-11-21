var fs = require("fs");
var http = require("http");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("students.db");

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
                    db.all("SELECT * FROM STUDENT", function(err, rows) { 
                        if(err) {
                            student = {
                                name: 'no',
                                grp: 'no'
                            }
                            response.write(JSON.stringify(student));
                        } else {
                            arr = []
                            for(var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                student = {
                                    name: row.name,
                                    grp: row.grp
                                }
                                arr.push(student);
                            }
                            response.write(JSON.stringify(arr));
                        }
                        response.end(); 
                    });
                    break;
                default:
                    arr = []
                    var name = str[1];

                    db.serialize(function() {
                        var stmt = db.prepare("SELECT * FROM STUDENT WHERE name=?");
                        stmt.each(name, function(err, row) {
                            student = {
                                name: row.name,
                                grp: row.grp
                            };
                            arr.push(student);
                        }, function(err, count) {
                            stmt.finalize();
                            if (err){
                                student = {
                                    name: "no",
                                    grp: "no"
                                };
                                arr.push(student)
                            }
                            response.write(JSON.stringify(arr));
                            response.end()
                        });
                      
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
  