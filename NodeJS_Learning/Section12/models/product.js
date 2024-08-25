const mongodb = require(`mongodb`);
const getDB = require(`../util/database`).getDB;

class Product {
  constructor(title, price, description, imageURL, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id ? mongodb.ObjectId.createFromHexString(id) : null;
  }
  save() {
    const db = getDB();
    let neededProduct;
    if (this._id) {
      console.log(this._id);
      neededProduct = db
        .collection(`products`)
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      neededProduct = db.collection(`products`).insertOne(this);
    }
    return neededProduct
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection(`products`)
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDB();
    return db
      .collection(`products`)
      .find({ _id: mongodb.ObjectId.createFromHexString(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDB();
    return db
      .collection(`products`)
      .deleteOne({ _id: mongodb.ObjectId.createFromHexString(productId) })
      .then(() => console.log(`Deleted`))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
