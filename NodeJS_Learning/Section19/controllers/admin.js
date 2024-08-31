const { validationResult } = require(`express-validator`);

const Product = require(`../models/product`);

const errorInvoker = require(`../util/errorInvoker`);

exports.getAddProduct = (_, res, next) => {
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

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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
    .catch(() => {
      return next(
        errorInvoker(`Database operation failed while post adding!`, 500)
      );
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode || editMode !== `true`) {
    return res.render(`admin/edit-product`, {
      pageTitle: `Add Product`,
      path: `/admin/add-product`,
      editing: false,
      hasError: false,
      product: null,
      errorMessage: `Verify the editing mode parameter.`,
      validationErrors: [],
    });
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.render(`/admin/edit-product`, {
          pageTitle: `Edit Product`,
          path: `/admin/edit-product`,
          editing: false,
          hasError: true,
          product: null,
          errorMessage: `Product not found.`,
          validationErrors: [],
        });
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
    .catch(() => {
      return next(
        errorInvoker(
          `Database operation failed while editing, please try again.`,
          500
        )
      );
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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
      if (!product) {
        return next(errorInvoker(`Product not found.`, 404));
      }

      if (product.userId.toString() !== req.user._id.toString()) {
        return next(
          errorInvoker(`Unauthorized access for non-related products`, 403)
        );
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
    .catch(() => {
      return next(
        errorInvoker(
          `Database operation failed while post editing, please try again.`,
          500
        )
      );
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render(`admin/products`, {
        prods: products,
        pageTitle: `Admin Products`,
        path: `/admin/products`,
      });
    })
    .catch(() => {
      return next(
        errorInvoker(
          `Database operation failed while retrieving products, please try again.`,
          500
        )
      );
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log(`DESTROYED PRODUCT`);
      res.redirect(`/admin/products`);
    })
    .catch(() => {
      return next(
        errorInvoker(
          `Database operation failed while deleting the product, please try again.`,
          500
        )
      );
    });
};
