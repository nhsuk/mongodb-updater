const downloadFile = require('./downloadFile');
const fileHelper = require('./utils/fileHelper');
const importDataFromFile = require('./mongodb/importDataFromFile');
const config = require('../config/config');

async function runMongoDbImport(filename) {
  return importDataFromFile(`${config.INPUT_DIR}/${filename}`,
    config.mongodb.collection, config.mongodb.connectionString,
    config.THRESHOLD);
}

async function updateDatabase() {
  const filename = fileHelper.filenameFromUrl(config.JSON_FILE_URL);
  await downloadFile(config.JSON_FILE_URL, filename);
  return runMongoDbImport(filename);
}

module.exports = updateDatabase;
