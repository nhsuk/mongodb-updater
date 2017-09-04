const fs = require('fs');

function loadDatabaseConfig(dbName) {
  if (dbName) {
    const path = `config/databases/${dbName}.json`;
    const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
    return jsonString ? JSON.parse(jsonString) : {};
  }
  return {};
}

function getDb(dbConfig) {
  const db = process.env.MONGO_DB || dbConfig.db;
  if (db) {
    return db;
  }
  throw new Error('either MONGO_DB must be set or a valid DB_CONFIG provided');
}

function getCollection(dbConfig) {
  const collection = process.env.MONGO_COLLECTION || dbConfig.collection;
  if (collection) {
    return collection;
  }
  throw new Error('either MONGO_COLLECTION must be set or a valid DB_CONFIG provided');
}

function getMongoDbConfig() {
  const dbConfig = loadDatabaseConfig(process.env.DB_CONFIG);
  const host = process.env.MONGO_HOST;
  const port = process.env.MONGO_PORT || '27017';
  const db = getDb(dbConfig);
  const collection = getCollection(dbConfig);
  const idKey = process.env.KEY_FOR_MONGO_ID || dbConfig.idKey;
  const index = dbConfig.index;
  const connectionString = process.env.MONGO_CONNECTION_STRING || `mongodb://${host}:${port}/${db}`;

  const mongodb = {
    collection,
    connectionString,
    index,
    idKey,
  };

  return mongodb;
}

module.exports = getMongoDbConfig;
