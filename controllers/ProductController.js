import { Category } from "../models/CategoriesModel.js";
import { Product } from "../models/ProductModel.js";
import { Size } from "../models/sizeSchema.js";
import { Subcategory } from "../models/SubCategoriesModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      subcategoryId,
      isVariant,
      size,
      quantity,
      title,
      descriptions,
    } = req.body;
    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !categoryId ||
      !title ||
      !descriptions ||
      !subcategoryId ||
      isVariant === undefined
    )
      return next(new ErrorHandler("Please enter all fields", 400));

    let images = [];
    const singleImage = req.files["image"] ? req.files["image"][0] : null;
    const multipleImages = req.files["images"] || [];

    if (singleImage) {
      let obj = {
        public_id: singleImage.filename,
        url: singleImage.path,
      };
      images.push(obj);
    }

    for (let i = 0; i < multipleImages.length; i++) {
      const file = multipleImages[i];
      let obj = {
        public_id: file.filename,
        url: file.path,
      };

      images.push(obj);
    }
    let productVariant = [];

    if (isVariant) {
      for (let i = 0; i < size.length; i++) {
        const variantObj = {
          size: size[i],
          stock: stock[i], // Assuming stock and size arrays have corresponding elements
          quantity: quantity[i],
        };
        productVariant.push(variantObj);
      }
    }

    let additionalInfos = [];
    for (let i = 0; i < title.length; i++) {
      const additional = {
        title: title[i],
        descriptions: descriptions[i],
      };
      additionalInfos.push(additional);
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: categoryId,
      Subcategory: subcategoryId,
      isVariant,
      ProductVaraint: productVariant,
      additionalInfo: additionalInfos,
      stock,
      poster: images,
    });

    res.status(201).json({
      success: true,
      message: "product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const product = await Product.find();
    if (!product)
      return next(new ErrorHandler("Product are not availabe ", 404));
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate([
      "category",
      "Subcategory",
      "ProductVariant",
    ]);
    if (!product) return next(new ErrorHandler("Product not found", 404));
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found", 404));
    // let productImage = product.poster.length;
    if (product.poster.length > 0) {
      for (let i = 0; i < product.poster.length; i++) {
        const image = product.poster[i];
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found", 404));
    const { name, description, price, categoryId, subcategoryId, stock,size,quantity,title, descriptions } =
      req.body;
    const singleImage = req.files["image"] ? req.files["image"][0] : null;
    const multipleImages = req.files["images"] || [];

    if (singleImage) {
      const Image = [];
      const newImage = {
        public_id: singleImage.filename,
        url: singleImage.path,
      };
      Image.push(newImage);
      for (let i = 0; i < product.poster.length; i++) {
        const image = product.poster[i];
        await cloudinary.uploader.destroy(image.public_id);
      }
      product.poster = Image || product.poster;
    }
    if (multipleImages) {
      const newImages = [];
      for (let i = 0; i < multipleImages.length; i++) {
        const file = multipleImages[i];
        let obj = {
          public_id: file.filename,
          url: file.path,
        };
        newImages.push(obj);
        for (let i = 0; i < product.poster.length; i++) {
          const image = product.poster[i];
          await cloudinary.uploader.destroy(image.public_id);
        }
        product.poster = newImages || product.poster;
      }
    }
    if (name) {
      product.name = name || product.name;
    }
    if (description) {
      product.description = description || product.description;
    }
    if (price) {
      product.price = price || product.price;
    }
    if (categoryId) {
      product.category = categoryId || product.category;
    }
    if (subcategoryId) {
      product.Subcategory = subcategoryId || product.Subcategory;
    }
    if (stock) {
      product.stock = stock || product.stock;
    }
    if (size && quantity) {
      product.ProductVaraint = size.map((size, i) => ({
        size,
        quantity: quantity[i],
      }));
    }

    await product.save();

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

// CAtegories Controller start here

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new ErrorHandler("please enter all fields", 400));
    const category = await Category.create({
      name,
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};
export const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find({});
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler("Invalid Category Id"));
    const { name } = req.body;
    if (!name) {
      return next(new ErrorHandler("please Enter al fields"));
    } else {
      category.name = name || category.name;
    }

    await category.save();
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler("Invalid Category Id"));
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: "Category deleted successfully please update Subcategory also",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

//SubCategory
export const CreateSubCategory = async (req, res, next) => {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId || !name)
      return next(new ErrorHandler("please enter all Fields"));
    const findCategory = await Category.findById(categoryId);
    if (!findCategory) return next(new ErrorHandler("Invalid Category", 400));
    const subCategory = await Subcategory.create({
      name,
      category: categoryId,
    });
    res.status(201).json({
      success: "true",
      message: "SubCategory created successfully",
      subCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

export const getAllSubCategoryAdmin = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.find({}).populate("category");
    res.status(200).json({
      success: true,
      subcategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

export const getAllSubCategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.find({});
    res.status(200).json({
      success: true,
      subcategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subcategory = await Subcategory.findById(req.params.id);
    const { categoryId, name } = req.body;
    console.log(subcategory);
    if (!subcategory || subcategory == "")
      return next(new ErrorHandler("Subcategory Not Found", 404));
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return next(new ErrorHandler("Category Not found", 404));
      }
      subcategory.category = categoryId || subcategory.category;
    }
    if (name) {
      subcategory.name = name || subcategory.name;
    }
    res.status(200).json({
      success: true,
      message: "subcategory updated Successfully",
      subcategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return next(new ErrorHandler("Not Found", 404));
    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

// add size

export const addsize = async (req, res, next) => {
  try {
    const { size } = req.body;
    if (!size) return next(new ErrorHandler("please enter fileds", 400));
    const sizes = await Size.create({
      size,
    });
    res.status(200).json({
      success: true,
      sizes,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getsize = async (req, res, next) => {
  const size = await Size.find({});
  res.status(200).json({
    size,
  });
};
