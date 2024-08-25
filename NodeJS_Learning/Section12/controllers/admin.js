const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.imageUrl,
    null
  );
  product
    .save()
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode || editMode === "false") {
    return res.redirect("/");
  }
  Product.findById(req.params.productId)
    .then((product) => {
      console.log(product);
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        product: product,
        path: "/admin/edit-product",
        editing: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const updatedProduct = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.imageUrl,
    req.body.productId,
    req.user._id
  );
  updatedProduct
    .save()
    .then(() => {
      console.log("Product Updated");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteById(req.body.productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
