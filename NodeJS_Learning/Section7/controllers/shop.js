const Product = require(`../models/product`);

// exports.getIndex = (req, res) => {
//   Product.fetchAll((products) => {
//     console.log(products);
//     // res.render(`shop/index`, {
//     //   prods: products,
//     //   docTitle: `Index Page`,
//     //   path: `/`,
//     // });
//   });
//   res.redirect(`/`);
// };

exports.getCart = (req, res) => {
  res.render(`shop/cart`, {
    docTitle: `Cart Page`,
    path: `/cart`,
  });
};

exports.getCheckout = (req, res) => {
  res.render(`shop/checkout`, {
    docTitle: `Checkout Page`,
    path: `/checkout`,
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render(`shop/product-list`, {
      prods: products,
      docTitle: `Shop Page`,
      path: `/products`,
    })
  );
};
