const Product = require(`../models/product`);
const Cart = require(`../models/cart`);

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render(`shop/index`, {
      prods: products,
      docTitle: `Index Page`,
      path: `/`,
    });
  });
};

exports.getProductById = (req, res) => {
  Product.findById(req.params.productId, (product) => {
    res.render(`shop/product-detail`, {
      product: product,
      docTitle: product.title,
      path: `/products`,
    });
  });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect(`/cart`);
};

exports.getCart = (req, res) => {
  res.render(`shop/cart`, {
    docTitle: `Cart Page`,
    path: `/cart`,
  });
};

exports.getCheckout = (req, res) => {
  res.render(`shop/checkout`, {
    docTitle: `Checkout Page`,
    path: `/checkout`,
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render(`shop/product-list`, {
      prods: products,
      docTitle: `Shop Page`,
      path: `/products`,
    })
  );
};
