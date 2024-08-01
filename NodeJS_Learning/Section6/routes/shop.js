const express = require(`express`);
const adminData = require(`./admin`);

const router = express.Router();

router.get(`/`, (req, res) => {
  console.log(adminData.products);
  res.render(`shop`, {
    prods: adminData.products,
    docTitle: `Shop Page`,
    path: `/`,
  });
});

module.exports = router;
