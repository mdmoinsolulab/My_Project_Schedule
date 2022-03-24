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
import Validate from "../helpers/validation.js";
import Enum from "../helpers/enumtypes.js";
import { verifyTokenAndAdmin, verifyTokenAndVendor } from "./verifyToken.js";

router.post(
  "/addProduct",
  Validate(Enum.ADDPRODUCT),
  verifyTokenAndVendor,
  addProduct
);
router.put(
  "/updateProduct/:productId",
  Validate(Enum.UPDATEPRODUCT),
  verifyTokenAndVendor,
  updateProduct
);
router.put(
  "/admin/updateProduct/:userId/:productId",
  Validate(Enum.UPDATEPRODUCT),
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
