const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const matchedProductsInCart = [];
      for (const product of products) {
        const productExistInCart = cart.products.find(
          (p) => p.id === product.id
        );
        if (productExistInCart) {
          matchedProductsInCart.push({
            productData: product,
            quantity: productExistInCart.qty,
          });
        }
      }
      res.render("shop/cart", {
        products: matchedProductsInCart,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    });
  });
};

exports.postCart = (req, res) => {
  Product.findById(req.body.productId, (product) => {
    Cart.addProduct(req.body.productId, product.price);
    res.redirect("/cart");
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const targetProductId = req.body.productId;
  Product.findById(targetProductId, (product) => {
    Cart.dispatchProduct(targetProductId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
