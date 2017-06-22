const log = require('../utils/logger');
const MongoWrapper = require('./mongoWrapper');
const config = require('../../config/config');

function addMongoId(data) {
  if (config.mongodb.idKey) {
    data.forEach((item) => {
      /* eslint-disable no-param-reassign */
      /* eslint-disable no-underscore-dangle */
      item._id = item[config.mongodb.idKey];
    });
  }
}

class DataImporter {
  constructor(connectionString, collection, threshold) {
    this.mongoWrapper = new MongoWrapper(connectionString);
    this.collection = collection;
    this.collectionTemp = `${collection}_temp`;
    this.threshold = threshold;
  }

  async dropCollection(collection) {
    const count = await this.mongoWrapper.getTotalCount(collection);
    if (count > 0) {
      log.info(`dropping existing collection '${collection}'...`);
      return this.mongoWrapper.dropCollection(collection);
    }
    return true;
  }

  async cleanupTempCollection() {
    return this.dropCollection(this.collectionTemp);
  }

  async removeOriginalCollection() {
    return this.dropCollection(this.collection);
  }

  async insertDataToTemporaryCollection(data) {
    log.info(`inserting data to collection '${this.collectionTemp}'...`);
    return this.mongoWrapper.insertMany(this.collectionTemp, data);
  }

  async validateData() {
    log.info('Validating data...');
    const currentCount = await this.mongoWrapper.getTotalCount(this.collection);
    const newCount = await this.mongoWrapper.getTotalCount(this.collectionTemp);

    log.info(`New count: '${newCount}', previous count: '${currentCount}'`);
    if (newCount < currentCount * this.threshold) {
      throw new Error(`Total records has dropped from ${currentCount} to ${newCount}. Update cancelled`);
    }
  }

  async addIndexes() {
    const index = config.mongodb.index;
    if (index) {
      await this.mongoWrapper.createIndex(this.collection, index.keys, index.options);
    }
  }

  async renameTempCollection() {
    log.info(`Renaming: '${this.collectionTemp}' to '${this.collection}'`);
    return this.mongoWrapper.renameCollection(this.collectionTemp, this.collection);
  }

  async importData(data) {
    try {
      addMongoId(data);
      await this.mongoWrapper.openConnection();
      await this.cleanupTempCollection();
      await this.insertDataToTemporaryCollection(data);
      await this.validateData();
      await this.removeOriginalCollection();
      await this.renameTempCollection();
      await this.addIndexes();
      log.info('Import finished');
      return this.mongoWrapper.closeConnection();
    } catch (err) {
      // don't delete temp collection so data can be viewed if it has failed
      log.error(`Error importing data: ${err}`);
      return this.mongoWrapper.closeConnection();
    }
  }

}

module.exports = DataImporter;
