# Scheduled service to load data from a URL into a mongo database

The mongob-updater is a dockerised application that will update a mongo database on a regular basis from a given URL.

The  file specified in the `JSON_FILE_URL` environment variable will be used as the source of the database update if
it is available, valid JSON, and if the total count has not dropped by a significant amount as described in `CHANGE_THRESHOLD` below.

The application will download the JSON data, insert it into a mongodb database on startup.
The destination database is specified in the `MONGO_HOST`, `MONGO_PORT`, `MONGO_DB` and `MONGO_COLLECTION` variables.
If a unique identifier in the source data should be used as the collection's ID, the `KEY_FOR_MONGO_ID` can be set.
This will set the `_id` for each record inserted to the value of the key.

Common database configurations are stored in the `config/databases` folder. These can be used by setting the `DB_CONFIG`
environment variable to the config file name, i.e. `pharmacy`. The available settings are `db`, `collection`, `index` and `idKey`.
Note: the `index` may only bet set via a database config file, as it is a rich JSON object containing index keys and options.

The download and database insert will run on startup, then on a daily schedule while the container continues to run.
The time of day defaults to 7am, and can be changed via the `UPDATE_SCHEDULE` environment variable.
The schedule is run using `node-schedule` which uses a cronlike syntax. Further details on node-schedule available [here](https://www.npmjs.com/package/node-schedule)
Note: the container time is GMT and does not take account of daylight saving, you may need to subtract an hour from the time if it is currently BST.

When updating the mongo database the new data will be inserted into a temporary collection, then validated against the
existing collection. Once validation passes the existing collection will be deleted and the temporary collection renamed
to take its place.

Validation will fail if the count of records drops significantly. The allowable drop in record count is controlled by 
the `CHANGE_THRESHOLD` environment variable. By default this is set to `0.99` which prevents the data being loaded if it 
is 1% less than the previous count.


| Variable                         | Description                                                        | Default               | Required |
|:---------------------------------|:-------------------------------------------------------------------|-----------------------|:---------|
| `NODE_ENV`                       | node environment                                                   | development           |          |
| `LOG_LEVEL`                      | [log level](https://github.com/trentm/node-bunyan#levels)          | Depends on `NODE_ENV` |          |
| `JSON_FILE_URL`                  | Publicly available URL of JSON data                                |                       | yes      |
| `MONGO_HOST`                     | host name of mongo server                                          |                       | yes      |
| `DB_CONFIG`                      | database configuration to read, currently only 'pharmacy' avaiable |                       | *        |
| `MONGO_PORT`                     | port of mongo server                                               | 27017                 |          |
| `MONGO_DB`                       | mongo database to be updated                                       |                       | *        |
| `MONGO_COLLECTION`               | mongo collection to be updated                                     |                       | *        |
| `KEY_FOR_MONGO_ID`               | key in the source json data to use as the record's '_id'           |                       | no       |
| `CHANGE_THRESHOLD`               | factor the data count can drop by before erroring                  | 0.99                  |          |
| `UPDATE_SCHEDULE`                | time of day to run the upgrade                                     | 0 7 * * *  (7 am)     |          |

\* Either the `DB_CONFIG` must be set, or both the `MONGO_DB` and `MONGO_COLLECTION` variables must be set.
