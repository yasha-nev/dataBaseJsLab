//brew services start cassandra  
//brew services stop cassandra  

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);


async function run() {
  try {
      await mongoClient.connect();

      const db = mongoClient.db("studentdb");
      const collection = db.collection("student");

      await collection.insertMany([
        {
          name: 'yasha',
          grp: '20pm'
        },
        {
          name: 'egor',
          grp: '20pm'
        },
        {
          name: 'kirill',
          grp: '20pm'
        },
        {
          name: 'vera',
          grp: '20pm'
        },
        {
          name: 'yasha',
          grp: '20pm'
        },
        {
          name: 'yasha',
          grp: '20pm'
        },
        {
          name: 'yasha',
          grp: '20pm'
        }
      ]);

      const count = await collection.countDocuments();
      console.log(`В коллекции users ${count} документов`);

  }catch(err) {
      console.log(err);
  } finally {
      await mongoClient.close();
  }
}
run().catch(console.error);
