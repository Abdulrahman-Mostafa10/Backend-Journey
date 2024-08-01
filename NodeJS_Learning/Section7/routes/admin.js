const express = require(`express`);

const router = express.Router();

const adminController = require(`../controllers/admin`);

router.get(`/add-product`, adminController.getAddProductPage);

router.post(`/add-product`, adminController.postAddProductPage);

router.get(`/products`, adminController.getProducts);

module.exports = router;
