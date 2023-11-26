//brew services start cassandra  
//brew services stop cassandra  

const cassandra = require('cassandra-driver');
const Uuid = cassandra.types.Uuid;

const contactPoints = ['127.0.0.1'];
const localDataCenter = 'datacenter1';
const keyspace = 'mykeyspace';

const client = new cassandra.Client({ contactPoints, localDataCenter });

async function createDatabaseAndTable() {
  try {
    await client.connect();

    const createKeyspaceQuery = "CREATE KEYSPACE IF NOT EXISTS " + keyspace +
      " WITH replication = {" +
        "'class': 'SimpleStrategy'," +
        "'replication_factor': 1" +
      "};"

    await client.execute(createKeyspaceQuery);
    await client.execute("USE " + keyspace);

    const dropTable = "DROP TABLE IF EXISTS " +  keyspace + ".student"

    await client.execute(dropTable)

    // Создание таблицы
    const createTableQuery = "CREATE TABLE IF NOT EXISTS " + keyspace + ".student (" +
      "id UUID PRIMARY KEY," +
      "name TEXT," +
      "grp TEXT" +
    ");"

    await client.execute(createTableQuery);

    const index = "CREATE INDEX name_key ON " + keyspace + ".student (name);"

    await client.execute(index);

    const createStudent = "INSERT INTO " + keyspace + ".student(id, name, grp) VALUES (?, ?, ?)"

    await client.execute(createStudent, [Uuid.random(), "yasha", "20pm"], { prepare: true })
    await client.execute(createStudent, [Uuid.random(), "egor", "20pm"], { prepare: true })
    await client.execute(createStudent, [Uuid.random(), "kiril", "20pm"], { prepare: true })
    await client.execute(createStudent, [Uuid.random(), "vera", "20pm"], { prepare: true })
    await client.execute(createStudent, [Uuid.random(), "yasha", "20pm"], { prepare: true })
    await client.execute(createStudent, [Uuid.random(), "yasha", "20pm"], { prepare: true })

    console.log('База данных и таблица успешно созданы!');
  } finally {
    await client.shutdown();
  }
}

createDatabaseAndTable().catch(console.error);