const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT || '27017';
const db = process.env.MONGO_DB;
const collection = process.env.MONGO_COLLECTION;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'mongodb-updater',
  JSON_FILE_URL: process.env.JSON_FILE_URL,
  INPUT_DIR: './input',
  // percentage the records can drop by before erroring
  THRESHOLD: process.env.CHANGE_THRESHOLD || 0.99,
  // cron style job, default to 7am
  UPDATE_SCHEDULE: process.env.UPDATE_SCHEDULE || '0 7 * * *',

  mongodb: {
    collection,
    connectionString: `mongodb://${host}:${port}/${db}`,
  },
};
