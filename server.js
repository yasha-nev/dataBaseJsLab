
var fs = require("fs");
var http = require("http");
const neo4j = require('neo4j-driver'); 
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678')); 
const session = driver.session(); 


async function getStudent(){
    //let n = await driver.executeQuery('MATCH (n:Student) RETURN n')

    arr = []
    let { records, summary } = await driver.executeQuery(
    'MATCH (s:Student) RETURN s.name AS name, s.grp AS grp',
    {},
    { database: 'neo4j' }
    )

    for(let record of records) {  
        arr.push({
            name: record.get('name'),
            grp: record.get('grp')
        })
    }
    return arr;
}

async function getStudentByName(nm){
    arr = []
    let { records, summary } = await driver.executeQuery(
    "MATCH (s:Student WHERE s.name = $name) RETURN s.name AS name, s.grp AS grp",
    {name: nm},
    { database: 'neo4j' }
    )

    for(let record of records) {  
        arr.push({
            name: record.get('name'),
            grp: record.get('grp')
        })
    }

    console.log(arr);

    return arr;
}


http.createServer(async function (request, response) {
    var str = request.url.split('=');
    
    console.log(request.url)

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


