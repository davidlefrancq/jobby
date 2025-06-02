const dbName = process.env.MONGO_INITDB_DATABASE;
const collectionName = process.env.MONGO_INITDB_COLLECTION_NAME;

db = db.getSiblingDB(dbName);
db.createUser(
  {
    user: process.env.MONGO_NON_ROOT_USERNAME,
    pwd: process.env.MONGO_NON_ROOT_PASSWORD,
    roles: [
      {
        role: "readWrite",
        db: dbName
      }
    ]
  }
);
db.createCollection(collectionName);

db[collectionName].createIndex(
  { original_job_id: 1 },
  { unique: true }
);

db[collectionName].createIndex(
  { preference: 1 }
);
