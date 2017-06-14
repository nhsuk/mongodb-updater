const fileHelper = require('../utils/fileHelper');
const DataImporter = require('./dataImporter');

async function importDataFromFile(filename, collection, connectionString, threshold) {
  const data = fileHelper.loadJson(filename);
  const dataImporter = new DataImporter(connectionString, collection, threshold);
  await dataImporter.importData(data);
}

module.exports = importDataFromFile;
