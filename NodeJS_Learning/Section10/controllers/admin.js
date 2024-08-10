const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  req.user
    .createProduct({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    })
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
  Product.findByPk(req.params.productId)
    .then((product) => {
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
  Product.findByPk(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      return product.save();
    })
    .then(() => {
      console.log("Product is updated");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  req.user
    .getProducts()
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
  Product.destroy({
    where: {
      id: req.body.productId,
    },
  })
    .then(() => {
      console.log("Product is destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
