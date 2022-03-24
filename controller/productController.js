import Product from "../models/Product.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";

//CREATE PRODUCT
const addProduct = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const newProduct = new Product(req.body);
    await newProduct.save();
    if (!newProduct) {
      return sendResponse(res, 404, "Failed to add the product");
    }
    return sendResponse(res, 200, newProduct);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: { $eq: req.params.productId },
        userId: { $eq: req.user.id },
        isDeleted: { $eq: false },
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updateProduct) {
      return sendResponse(res, 404, "Failed to update the product");
    }
    return sendResponse(res, 200, updatedProduct);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE PRODUCT FOR ADMIN
const updateProductForAdmin = async (req, res) => {
  try {
    req.body.userId = req.params.userId;
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: { $eq: req.params.productId },
        userId: { $eq: req.params.userId },
        isDeleted: { $eq: false },
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updateProduct) {
      return sendResponse(res, 404, "Failed to update the product");
    }
    return sendResponse(res, 200, updatedProduct);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE DISCOUNT
const updateDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    let product = await Product.find({
      _id: { $eq: req.params.productId },
      userId: { $eq: req.user.id },
      isDeleted: { $eq: false },
    });

    if (!product) {
      return sendResponse(res, 404, "Failed to update the product");
    }

    product[0].discount = discount;
    const newCart = new Product(product[0]);
    await newCart.save();

    return sendResponse(res, 201, "Updated Product Discount");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: { $eq: req.params.productId },
      userId: { $eq: req.user.id },
      isDeleted: { $eq: false },
    });
    if (!product) {
      return sendResponse(res, 404, "Failed to delete the product");
    }
    return sendResponse(res, 200, "Product has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE PRODUCT FOR ADMIN
const deleteProductForAdmin = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: { $eq: req.params.productId },
      userId: { $eq: req.params.userId },
      isDeleted: { $eq: false },
    });
    if (!product) {
      return sendResponse(res, 404, "Failed to delete the product");
    }
    return sendResponse(res, 200, "Product has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET PRODUCT
const getProduct = async (req, res) => {
  if (req.params.productId) {
    try {
      const product = await Product.findOne({
        _id: { $eq: req.params.productId },
      });
      if (!product) {
        return sendResponse(res, 404, "Failed to get the product");
      }
      if (product.isDeleted === true) {
        return sendResponse(res, 404, "Product Has Been Deleted");
      }
      return sendResponse(res, 200, product);
    } catch (err) {
      return sendResponse(res, 500, err);
    }
  }
};

//GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    if (req.headers.page) {
      if (req.headers.page <= 0) {
        req.headers.page = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit <= 0) {
        req.headers.limit = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit > 100) {
        req.headers.limit = 100;
      }
    }
    let products;

    if (qNew) {
      products = await Product.find({ isDeleted: { $eq: false } })
        .sort({ createdAt: -1 })
        .limit(req.headers.limit * 1)
        .skip((req.headers.page - 1) * req.headers.limit);
    } else if (qCategory) {
      products = await Product.find({
        isDeleted: { $eq: false },
        categories: {
          $in: [qCategory],
        },
      })
        .limit(req.headers.limit * 1)
        .skip((req.headers.page - 1) * req.headers.limit);
    } else {
      products = await Product.find();
    }

    // if (qNew) {  recent
    //   products = await Product.find({ isDeleted: {$eq: false}}).sort({ createdAt: -1 }).limit(1);
    // } else if (qCategory) {
    //   products = await Product.find({
    //     isDeleted: {$eq: false},
    //     categories: {
    //       $in: [qCategory],
    //     },
    //   });
    // } else {
    //   products = await Product.find();
    // }

    return sendResponse(res, 200, products);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

export {
  addProduct,
  updateProduct,
  updateProductForAdmin,
  updateDiscount,
  deleteProduct,
  deleteProductForAdmin,
  getProduct,
  getAllProducts,
};
