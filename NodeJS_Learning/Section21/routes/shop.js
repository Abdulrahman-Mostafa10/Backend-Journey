const express = require(`express`);

const shopController = require(`../controllers/shop`);
const isAuth = require(`../middleware/is-Auth`);

const router = express.Router();

router.get(`/`, shopController.getIndex);
router.get(`/products`, shopController.getProducts);
router.get(`/products/:productId`, shopController.getProduct);
router.get(`/cart`, isAuth, shopController.getCart);
router.get(`/orders`, isAuth, shopController.getOrders);
router.get(`/orders/:orderId`, isAuth, shopController.getInvoice);

router.post(`/cart`, isAuth, shopController.postCart);
router.post(`/cart-delete-item`, isAuth, shopController.postCartDeleteProduct);
router.post(`/create-order`, isAuth, shopController.postOrder);

module.exports = router;
