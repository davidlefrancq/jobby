const dbName = process.env.MONGO_INITDB_DATABASE;

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

// Create jobs collection
db.createCollection("jobs");

db["jobs"].createIndex(
  { original_job_id: 1 },
  { unique: true }
);

db["jobs"].createIndex(
  { preference: 1 }
);


// Create CV collection
db.createCollection("curriculum_vitaes");
