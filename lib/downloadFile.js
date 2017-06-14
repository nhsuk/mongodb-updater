const fileHelper = require('./utils/fileHelper');
const log = require('./utils/logger');
const appConfig = require('../config/config');
const apiRequest = require('./utils/apiRequest');

function validatedAgainstPrevious(json, path) {
  const prevJson = fileHelper.loadJson(path);
  if (json.length < prevJson.length * appConfig.THRESHOLD) {
    throw new Error(`Total records has dropped from ${prevJson.length} to ${json.length}`);
  }
}

async function retrieveJson(url) {
  log.info(`Downloading file from ${url}`);
  const jsonString = await apiRequest(url);
  return jsonString ? JSON.parse(jsonString) : undefined;
}

async function downloadFile(url, filename) {
  const existingFile = `${appConfig.INPUT_DIR}/${filename}`;
  try {
    const newJson = await retrieveJson(url);
    validatedAgainstPrevious(newJson, existingFile);
    fileHelper.saveJson(newJson, existingFile);
    log.info(`${existingFile} saved`);
  } catch (ex) {
    log.error(`Error retrieving file ${url}, using existing local file. ${ex}`);
  }
}

module.exports = downloadFile;
