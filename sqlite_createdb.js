// brew services start neo4j
// brew services stop neo4j

const neo4j = require('neo4j-driver'); 
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678')); 

async function createDatabase() { 
  const session = driver.session(); 
  try {

    //const result = await session.run(
    //  'MATCH (n:Student) DELETE n'
    //);


    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "yasha", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "egor", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "vera", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "kirill", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "yasha", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "yasha", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "yasha", grp: "20pm"});
    await session.run('CREATE (a:Student {name: $name, grp: $grp}) RETURN a', {name: "yasha", grp: "20pm"});
    
    } 
  finally { 
    await session.close(); 
  } 
}

createDatabase()
