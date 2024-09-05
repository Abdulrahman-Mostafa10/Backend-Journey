const fs = require(`fs`);
const path = require(`path`);

const PDFDocument = require(`pdfkit`);

const Product = require(`../models/product`);
const Order = require(`../models/order`);
const errorInvoker = require(`../util/errorInvoker`);

const ITEMS_PER_PAGE = 1;

const paginationHelper = (renderPage, path, pageTitle, req, res) => {
  const page = +req.query.page || 1;
  let totalProducts;

  Product
    .find()
    .countDocuments()
    .then(productsNumber => {
      totalProducts = productsNumber;
      return Product
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render(`${renderPage}`, {
        prods: products,
        pageTitle: pageTitle,
        path: `/${path}`,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.getProducts = (req, res) => {
  paginationHelper(`shop/product-list`, `products`, `All Products`, req, res);
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render(`shop/product-detail`, {
        product: product,
        pageTitle: product.title,
        path: `/products`,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  paginationHelper(`shop/index`, ``, `Shop`, req, res);
};

exports.getCart = (req, res) => {
  req.user
    .populate(`cart.items.productId`)
    .then((user) => {
      const products = user.cart.items;
      res.render(`shop/cart`, {
        path: `/cart`,
        pageTitle: `Your Cart`,
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect(`/cart`);
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect(`/cart`);
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate(`cart.items.productId`)
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const orderOfUser = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return orderOfUser.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      console.log(`Order is created successfully`);
      res.redirect(`/orders`);
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render(`shop/orders`, {
        path: `/orders`,
        pageTitle: `Your Orders`,
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then(order => {
    if (!order) {
      return next(errorInvoker(`No order has been found`, 404));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(errorInvoker(`Unauthorized access for non-related orders`, 403));
    }

    const invoiceName = `Invoice-${orderId}.pdf`;
    const invoicePath = path.join(`data`, `invoices`, invoiceName);

    res.setHeader(`Content-type`, `application/pdf`);
    res.setHeader(`Content-Disposition`, `inline; filename="${invoiceName}"`);
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text(`Invoice`, {
      underline: true,
      isBold: true
    });
    pdfDoc.text(`--------------------------------------------------`);
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(prod.product.title + ` - ` + prod.quantity + ` x $` + prod.product.price);
    })
    pdfDoc.text(`--------------------------------------------------`);
    pdfDoc.fontSize(18).text(`Total Price: $` + totalPrice);
    pdfDoc.end();

  }).catch(() => {
    next(errorInvoker(`Database operation failed while editing, please try again.`, 500));
  })

};