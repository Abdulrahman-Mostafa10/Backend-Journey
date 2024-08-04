const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );

  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode || editMode === "false") {
    return res.redirect("/");
  }
  Product.findById(req.params.productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      editing: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const updatedProduct = new Product(
    req.body.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );

  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res) => {
  const targetProductId = req.body.productId;
  Product.dispatch(targetProductId);
  res.redirect("/admin/products");
};
