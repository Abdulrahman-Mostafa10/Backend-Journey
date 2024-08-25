const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://abdelrahman:bedo@cluster0.fccjy.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) return _db;
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
