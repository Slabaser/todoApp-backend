require("dotenv").config();
const { MongoClient } = require('mongodb');

const url = "mongodb+srv://sila123baser:5VXLiOe5imzgp0Jp@todoapp.gav83q2.mongodb.net/";
const dbName = 'todoapp';

let db;

async function connectToMongo() {
  const client = new MongoClient(url); // Removed deprecated options
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB");
}

connectToMongo();

module.exports = {
  query: async (collectionName, query, options = {}) => {
    if (!db) {
      throw new Error('Database not connected');
    }
    const collection = db.collection(collectionName);
    const sortOptions = { ...options, sort: { fieldName: -1 } };
    return collection.find(query, sortOptions).toArray();
  },
  insert: async (collectionName, document) => {
    if (!db) {
      throw new Error('Database not connected');
    }
    const collection = db.collection(collectionName);
    return collection.insertOne(document);
  },
  update: async (collectionName, filter, updateDoc, options = {}) => {
    if (!db) {
      throw new Error('Database not connected');
    }
    const collection = db.collection(collectionName);
    return collection.updateOne(filter, updateDoc, options);
  },
  delete: async (collectionName, filter, options = {}) => {
    if (!db) {
      throw new Error('Database not connected');
    }
    const collection = db.collection(collectionName);
    return collection.deleteMany(filter, options); // Update to deleteMany for batch deletion
  }
};