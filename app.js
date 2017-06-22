const schedule = require('node-schedule');
const requireEnv = require('require-environment-variables');

const updateDatabase = require('./lib/updateDatabase');
const log = require('./lib/utils/logger');
const config = require('./config/config');

requireEnv(['JSON_FILE_URL']);
requireEnv(['MONGO_HOST']);

async function runUpdater() {
  // run on initial start, then on the schedule
  await updateDatabase();

  log.info(`Scheduling mongodb update with rule '${config.UPDATE_SCHEDULE}'`);
  schedule.scheduleJob(config.UPDATE_SCHEDULE, () => {
    // this is an async function, but await is not allowed within a lambda expression
    updateDatabase();
  });
}

runUpdater();
