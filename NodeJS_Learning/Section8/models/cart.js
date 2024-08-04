const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
module.exports = class Cart {
  static addProduct(id, price) {
    let cart = { products: [], totalPrice: 0 };
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct = {};
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static dispatchProduct(id, price) {
    console.log("Dispatching product with id:", id);
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log("Error reading the cart file");
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const targetProduct = updatedCart.products.find(
        (product) => product.id === id
      );
      if (!targetProduct) {
        console.log("Product not found in cart");
        return;
      }
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );

      updatedCart.totalPrice =
        updatedCart.totalPrice - targetProduct.qty * price;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log("Error writing to cart file");
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
