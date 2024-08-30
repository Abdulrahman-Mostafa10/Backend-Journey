const { validationResult } = require(`express-validator`);

const Product = require(`../models/product`);

exports.getAddProduct = (_, res) => {
  res.render(`admin/edit-product`, {
    pageTitle: `Add Product`,
    path: `/admin/add-product`,
    editing: false,
    hasError: false,
    product: { title: ``, price: ``, description: ``, imageUrl: ``, _id: `` },
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render(`admin/edit-product`, {
      pageTitle: `Add Product`,
      path: `/admin/add-product`,
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        _id: req.user._id,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      console.log(`Product is created successfully`);
      return res.render(`admin/edit-product`, {
        pageTitle: `Add Product`,
        path: `/admin/add-product`,
        editing: false,
        hasError: false,
        product: product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect(`/`);
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect(`/`);
      }
      res.render(`admin/edit-product`, {
        pageTitle: `Edit Product`,
        path: `/admin/edit-product`,
        editing: true,
        hasError: false,
        product: product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render(`admin/edit-product`, {
      pageTitle: `Add Product`,
      path: `/admin/add-product`,
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect(`/`);
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save().then(() => {
        console.log(`Product is updated successfully`);
        res.redirect(`/admin/products`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render(`admin/products`, {
        prods: products,
        pageTitle: `Admin Products`,
        path: `/admin/products`,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log(`DESTROYED PRODUCT`);
      res.redirect(`/admin/products`);
    })
    .catch((err) => console.log(err));
};
