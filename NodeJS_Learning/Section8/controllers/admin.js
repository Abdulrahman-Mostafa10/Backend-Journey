const Product = require(`../models/product`);

exports.getAddProduct = (req, res) => {
  res.render(`admin/edit-product`, {
    docTitle: `Add-Product`,
    editMode: false,
    path: `/admin/add-product`,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.imageURL,
    req.body.price,
    req.body.description
  );
  product.save();
  res.redirect(`/admin/add-product`);
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  console.log(editMode);
  if (editMode == `false`) {
    return res.redirect(`/`);
  }
  Product.findById(req.params.productId, (product) => {
    if (!product) {
      return res.redirect(`/`);
    }
    res.render(`admin/edit-product`, {
      docTitle: `Edit-Product`,
      product: product,
      editMode: true,
      path: `/admin/edit-product`,
    });
  });
};

exports.postEditProduct = (req, res) => {
  res.redirect(`/admin/edit-product`);
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render(`admin/products`, {
      prods: products,
      docTitle: `Shop Page`,
      path: `/admin/products`,
    })
  );
};
