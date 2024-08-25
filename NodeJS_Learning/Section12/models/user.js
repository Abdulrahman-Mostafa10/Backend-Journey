const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class User {
  constructor(username, email, id, cart) {
    this.name = username;
    this.email = email;
    this._id = id;
    this.cart = cart ? cart : { items: [] };
  }

  save() {
    const db = getDB();
    return db.collection(`users`).insertOne(this);
  }

  getCart() {
    const db = getDB();
    if (!this.cart || !this.cart.items) {
      return Promise.resolve([]);
    }
    const productIds = this.cart.items.map((product) => {
      return product.productId;
    });
    return db
      .collection(`products`)
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((p) => {
              return p.productId.equals(product._id);
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDB();
    let updatedCart;
    const cartProductIndex = this.cart.items.findIndex((cp) =>
      cp.productId.equals(product._id)
    );
    updatedCart = { ...this.cart };
    if (cartProductIndex >= 0) {
      updatedCart.items[cartProductIndex].quantity =
        updatedCart.items[cartProductIndex].quantity + 1;
    } else {
      updatedCart.items.push({
        productId: product._id,
        quantity: 1,
      });
    }
    return db
      .collection(`users`)
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  deleteFromCart(productId) {
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(
      (product) => !product.productId.equals(productId)
    );
    return db
      .collection(`users`)
      .updateOne(
        { userId: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  getOrders() {
    const db = getDB();
    return db
      .collection(`orders`)
      .findOne({ userId: this._id })
      .then((orders) => {
        if (!orders || !orders.items) {
          return [];
        }
        const ordersIds = orders.items.map((item) => {
          return mongodb.ObjectId.createFromHexString(item.productId);
        });

        return db
          .collection(`products`)
          .find({ _id: { $in: ordersIds } })
          .toArray()
          .then((products) => {
            return products.map((product) => {
              return {
                ...product,
                quantity: orders.items.find((item) => {
                  return item.productId.toString() === product._id.toString();
                }).quantity,
              };
            });
          });
      })
      .catch((err) => console.log(err));
  }

  orderNow(productId) {
    const db = getDB();
    return db
      .collection(`orders`)
      .findOne({ userId: this._id })
      .then((orders) => {
        const order = this.cart.items.find((item) => {
          return item.productId.equals(productId);
        });

        if (!order) {
          throw new Error("Product not found in cart");
        }

        if (orders) {
          orders.items.push(order);
          return db
            .collection(`orders`)
            .updateOne({ userId: this._id }, { $set: { items: orders.items } });
        } else {
          return db.collection(`orders`).insertOne({
            userId: this._id,
            items: [
              {
                productId: productId,
                quantity: this.cart.items.find((item) => {
                  return item.productId.equals(productId);
                }).quantity,
              },
            ],
          });
        }
      })
      .then(() => {
        this.cart = this.cart.items.filter((item) => {
          return !item.productId.equals(productId);
        });
        return db
          .collection(`users`)
          .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDB();
    return db
      .collection(`users`)
      .findOne({ _id: mongodb.ObjectId.createFromHexString(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
