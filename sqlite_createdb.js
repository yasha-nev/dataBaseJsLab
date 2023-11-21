const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("students.db");

db.serialize(() => {
    db.run("CREATE TABLE Student (name TEXT, grp TEXT)");

    var stmt = db.prepare("INSERT INTO Student VALUES (?, ?)"); 
    stmt.run("yasha", "20pm");
    stmt.run("egor", "20pm");
    stmt.run("kiril", "20pm");
    stmt.run("vera", "20pm"); 
    stmt.run("yasha", "20pm"); 
    stmt.run("yasha", "20pm");
    
    stmt.finalize();
});

db.close();