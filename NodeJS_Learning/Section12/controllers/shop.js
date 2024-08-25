const Product = require("../models/product");

const retrieveProducts = (directedPage, pageTitle, path, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render(directedPage, {
        prods: products,
        pageTitle: pageTitle,
        path: path,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  retrieveProducts(`shop/product-list`, `All Products`, `/products`, res);
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  retrieveProducts(`shop/index`, `Shop`, `/`, res);
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
  req.user
    .deleteFromCart(req.body.productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders || [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .orderNow(req.body.productId)
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
