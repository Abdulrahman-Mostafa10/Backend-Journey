const express = require(`express`);

const { body } = require(`express-validator`);

const adminController = require(`../controllers/admin`);
const isAuth = require(`../middleware/is-Auth`);

const router = express.Router();

router.get(`/products`, adminController.getProducts);
router.get(`/add-product`, isAuth, adminController.getAddProduct);
router.get(`/edit-product/:productId`, isAuth, adminController.getEditProduct);

router.post(
  `/add-product`,
  isAuth,
  [
    body(`title`, `Title is invalid`).isString().isLength({ min: 3 }).trim(),
    body(`price`, `Price is invalid`).isNumeric().isFloat(),
    body(`description`, `Description is invalid`)
      .isLength({ min: 5, max: 400 })
      .trim()
      .isString(),
    body(`imageUrl`, `Image URL is invalid`)
      .isURL()
      .trim()
      .isString()
      .notEmpty(),
  ],
  adminController.postAddProduct
);
router.post(
  `/edit-product`,
  isAuth,
  [
    body(`title`, `Title is invalid`)
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .trim(),
    body(`price`, `Price is invalid`).isNumeric().isFloat().notEmpty(),
    body(`description`, `Description is invalid`)
      .isLength({ min: 5, max: 400 })
      .trim()
      .isString(),
    body(`imageUrl`, `Image URL is invalid`)
      .isURL()
      .trim()
      .isString()
      .notEmpty(),
  ],
  adminController.postEditProduct
);
router.post(`/delete-product`, isAuth, adminController.postDeleteProduct);

module.exports = router;
