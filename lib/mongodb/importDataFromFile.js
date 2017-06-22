const fileHelper = require('../utils/fileHelper');
const DataImporter = require('./dataImporter');

async function importDataFromFile(filename, collection, connectionString, threshold) {
  const data = fileHelper.loadJson(filename);
  if (data.length === 0) {
    throw new Error('File contains no data');
  }
  const dataImporter = new DataImporter(connectionString, collection, threshold);
  await dataImporter.importData(data);
}

module.exports = importDataFromFile;
