const log = require('../utils/logger');
const MongoClient = require('mongodb').MongoClient;

class MongoWrapper {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  openConnection() {
    return MongoClient.connect(this.connectionString)
      .then((db) => {
        log.info('mongo connection opened');
        this.db = db;
        return db;
      });
  }

  closeConnection() {
    if (this.db) {
      log.info('mongo connection closed');
      this.db.close();
    } else {
      log.info('mongo connection already closed');
    }
  }

  getCollection(collection) {
    return this.db.collection(collection);
  }

  async dropCollection(collection) {
    return this.getCollection(collection).drop();
  }

  async renameCollection(origName, newName) {
    return this.getCollection(origName).rename(newName);
  }

  async insertMany(collection, data) {
    return this.getCollection(collection).insert(data);
  }

  getTotalCount(collection) {
    return this.getCollection(collection).count();
  }

  createIndex(collection, keys, options) {
    return this.getCollection(collection).createIndex(keys, options);
  }
}

module.exports = MongoWrapper;
