const express = require(`express`);

const adminController = require(`../controllers/admin`);
const isAuth = require(`../middleware/is-Auth`);

const router = express.Router();

router.get(`/products`, adminController.getProducts);
router.get(`/add-product`, isAuth, adminController.getAddProduct);
router.get(`/edit-product/:productId`, isAuth, adminController.getEditProduct);

router.post(`/add-product`, isAuth, adminController.postAddProduct);
router.post(`/edit-product`, isAuth, adminController.postEditProduct);
router.post(`/delete-product`, isAuth, adminController.postDeleteProduct);

module.exports = router;
