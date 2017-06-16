const fs = require('fs');


function loadDatabaseConfig(dbName) {
  if (dbName) {
    const path = `config/databases/${dbName}.json`;
    const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
    return jsonString ? JSON.parse(jsonString) : {};
  }
  return {};
}

function getMongoDbConfig() {
  const dbConfig = loadDatabaseConfig(process.env.DB_CONFIG);
  const host = process.env.MONGO_HOST;
  const port = process.env.MONGO_PORT || '27017';
  const db = process.env.MONGO_DB || dbConfig.db;
  const collection = process.env.MONGO_COLLECTION || dbConfig.collection;
  const idKey = process.env.KEY_FOR_MONGO_ID || dbConfig.idKey;
  const index = dbConfig.index;

  const mongodb = {
    collection,
    connectionString: `mongodb://${host}:${port}/${db}`,
    index,
    idKey,
  };

  return mongodb;
}

module.exports = getMongoDbConfig;
