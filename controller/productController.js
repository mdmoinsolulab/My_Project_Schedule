import Product from "../models/Product.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";
import { validateParams } from "../utils/newValidate.js";

//CREATE PRODUCT
const addProduct = async (req, res) => {
  try {
    const id = req.user.id;
    const { title, desc, img, categories, price, color, discount, size } = req.body;
    const newProduct = new Product(
      {
        userId: id,
        title: title,
        desc: desc,
        img: img,
        categories: categories,
        size: size,
        color: color,
        price: price,
        discount: discount
      },
    );
    await newProduct.save();
    if (!newProduct) {
      return sendResponse(res, 404, "Failed to add the product");
    }
    return sendResponse(res, 200, newProduct);
  } catch (err) {
    if (err.name == 'MongoServerError') {
      Object.values(err.keyValue).forEach(e => {
      sendResponse(res, 500, `${e} already exists`)})
      return
    }
    return sendResponse(res, 500, err);
  }
};

//UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { title, desc, img, categories, price, color, discount, size } = req.body;
    const { productId } = req.params;
    const checkResult = validateParams(productId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: { $eq: productId },
        userId: { $eq: req.user.id },
        isDeleted: { $eq: false },
      },
      {
        //$set: req.body,
        $set: {
          title: title,
          desc: desc,
          img: img,
          categories: categories,
          size: size,
          color: color,
          price: price,
          discount: discount
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      return sendResponse(res, 404, "Failed to update the product");
    }
    return sendResponse(res, 200, updatedProduct);
  } catch (err) {
    if (err.name == 'MongoServerError') {
      Object.values(err.keyValue).forEach(e => {
      sendResponse(res, 500, `${e} already exists`)})
      return
    }
    return sendResponse(res, 500, err);
  }
};

//UPDATE PRODUCT FOR ADMIN
const updateProductForAdmin = async (req, res) => {
  try {
    const { title, desc, img, categories, price, color, discount, size } = req.body;
    const { productId, userId } = req.params;
    const checkFirstResult = validateParams(userId);
    console.log('these are the results : ', checkFirstResult)
    if (checkFirstResult != true) {
      return sendResponse(res, 500, checkFirstResult);
    }
    const checkSecondResult = validateParams(productId);
    console.log('these are the results : ', checkSecondResult)
    if (checkSecondResult != true) {
      return sendResponse(res, 500, checkSecondResult);
    }
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: { $eq: productId },
        userId: { $eq: userId },
        isDeleted: { $eq: false },
      },
      {
        //$set: req.body,
        $set: {
          title: title,
          desc: desc,
          img: img,
          categories: categories,
          size: size,
          color: color,
          price: price,
          discount: discount
        },
      },
      { new: true }
    );
    console.log('this is the product we got ', updatedProduct)
    if (!updatedProduct) {
      return sendResponse(res, 404, "Failed to update the product");
    }
    return sendResponse(res, 200, updatedProduct);
  } catch (err) {
    if (err.name == 'MongoServerError') {
      Object.values(err.keyValue).forEach(e => {
      sendResponse(res, 500, `${e} already exists`)})
      return
    }
    return sendResponse(res, 500, err);
  }
};

//UPDATE DISCOUNT
const updateDiscount = async (req, res) => {
  try {
    const id = req.user.id;
    const { discount } = req.body;
    const { productId } = req.params;
    const checkResult = validateParams(productId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    let product = await Product.findOne({
      _id: { $eq: productId },
      userId: { $eq: id },
      isDeleted: { $eq: false },
    });

    if (!product) {
      return sendResponse(res, 404, "Failed to update the Discount");
    }

    product.discount = discount;
    const newCart = new Product(product);
    await newCart.save();

    return sendResponse(res, 201, "Updated Product Discount");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const id = req.user.id;
    const { productId } = req.params;
    const checkResult = validateParams(productId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const product = await Product.findOneAndDelete({
      _id: { $eq: productId },
      userId: { $eq: id },
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
    const { productId, userId } = req.params;
    const checkFirstResult = validateParams(userId);
    console.log('these are the results : ', checkFirstResult)
    if (checkFirstResult != true) {
      return sendResponse(res, 500, checkFirstResult);
    }
    const checkSecondResult = validateParams(productId);
    console.log('these are the results : ', checkSecondResult)
    if (checkSecondResult != true) {
      return sendResponse(res, 500, checkSecondResult);
    }
    const product = await Product.findOneAndDelete({
      _id: { $eq: productId },
      userId: { $eq: userId },
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
    try {
      const { productId } = req.params;
      const checkResult = validateParams(productId);
      console.log('these are the results : ', checkResult)
      if (checkResult != true) {
        return sendResponse(res, 500, checkResult);
      }
      const product = await Product.findOne({
        _id: { $eq: productId },
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
};

//GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    // const qNew = req.query.new;
    // const qCategory = req.query.category;
    const { category: qCategory, page, new : qNew, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");
    }
    // if (req.headers.page) {
    //   if (req.headers.page <= 0) {
    //     req.headers.page = 1;
    //   }
    // }
    // if (req.headers.limit) {
    //   if (req.headers.limit <= 0) {
    //     req.headers.limit = 1;
    //   }
    // }
    // if (req.headers.limit) {
    //   if (req.headers.limit > 100) {
    //     req.headers.limit = 100;
    //   }
    // }
    let products;

    if (qNew) {
      products = await Product.find({ isDeleted: { $eq: false } })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (qCategory) {
      products = await Product.find({
        isDeleted: { $eq: false },
        categories: {
          $in: [qCategory],
        },
      })
        .limit(limit * 1)
        .skip((page - 1) * limit);
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
