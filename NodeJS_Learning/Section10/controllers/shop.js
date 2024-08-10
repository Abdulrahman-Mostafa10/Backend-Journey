const Product = require("../models/product");

const retrieveProducts = (directedPage, pageTitle, path, req, res) => {
  req.user
    .getProducts()
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
  retrieveProducts(`shop/product-list`, `All Products`, `/products`, req, res);
};

exports.getProduct = (req, res) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  retrieveProducts(`shop/index`, `Shop`, `/`, req, res);
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          products: products,
          pageTitle: "Your Cart",
          path: "/cart",
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  let updatedQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({ where: { id: req.body.productId } })
        .then((products) => {
          if (products.length > 0) {
            updatedQuantity = products[0].cartItem.quantity + 1;
            return products[0];
          }
          return Product.findByPk(req.body.productId);
        })
        .then((product) => {
          return cart
            .addProduct(product, {
              through: { quantity: updatedQuantity },
            })
            .then(() => {
              res.redirect("/cart");
            });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while adding a product to cart");
    });
};

exports.postCartDeleteProduct = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({ where: { id: req.body.productId } })
        .then((products) => {
          return products[0].cartItem.destroy().then(() => {
            res.redirect("/cart");
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        orders: orders,
        pageTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        return req.user
          .createOrder()
          .then((order) => {
            return order.addProducts(
              products.map((product) => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            );
          })
          .then(() => {
            return cart.setProducts(null);
          })
          .then(() => {
            res.redirect("/orders");
          });
      });
    })
    .catch((err) => console.log(err));
};
