const Product = require(`../models/product`);

exports.getAddProductPage = (req, res) => {
  res.render(`admin/add-product`, {
    docTitle: `Add-Product`,
    path: `/admin/add-product`,
  });
};

exports.postAddProductPage = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.imageURL,
    req.body.price,
    req.body.description
  );
  product.save();
  res.redirect(`/admin/add-product`);
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render(`admin/product-list`, {
      prods: products,
      docTitle: `Shop Page`,
      path: `/admin/products`,
    })
  );
};
