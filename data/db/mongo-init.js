db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser(
  {
    user: process.env.MONGO_NON_ROOT_USERNAME,
    pwd: process.env.MONGO_NON_ROOT_PASSWORD,
    roles: [
      {
        role: "readWrite",
        db: process.env.MONGO_INITDB_DATABASE
      }
    ]
  }
);
db.createCollection(process.env.MONGO_INITDB_COLLECTION_NAME);