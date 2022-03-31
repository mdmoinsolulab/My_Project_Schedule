import express from "express";
const router = express.Router();
import {
  addProduct,
  updateProduct,
  updateProductForAdmin,
  updateDiscount,
  deleteProduct,
  deleteProductForAdmin,
  getProduct,
  getAllProducts,
} from "../controller/productController.js";
import validate from '../utils/newValidate.js';
import { verifyTokenAndAdmin, verifyTokenAndVendor } from "../utils/verifyToken.js";

router.post(
  "/addProduct",
  validate,
  verifyTokenAndVendor,
  addProduct
);
router.put(
  "/updateProduct/:productId",
  validate,
  verifyTokenAndVendor,
  updateProduct
);
router.put(
  "/admin/updateProduct/:userId/:productId",
  validate,
  verifyTokenAndAdmin,
  updateProductForAdmin
);
router.put("/updateDiscount/:productId", verifyTokenAndVendor, updateDiscount);
router.delete("/deleteProduct/:productId", verifyTokenAndVendor, deleteProduct);
router.delete(
  "/admin/deleteProduct/:userId/:productId",
  verifyTokenAndAdmin,
  deleteProductForAdmin
);
router.get("/getProduct/:productId", getProduct);
router.get("/admin/getAllProducts", verifyTokenAndAdmin, getAllProducts);

export default router;
