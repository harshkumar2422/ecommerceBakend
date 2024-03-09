import express from "express";
import {
  CreateSubCategory,
  addsize,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteSubCategory,
  getAllCategory,
  getAllProduct,
  getAllSubCategory,
  getAllSubCategoryAdmin,
  getSingleProduct,
  getsize,
  updateCategory,
  updateProduct,
  updateSubCategory,
} from "../controllers/ProductController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";
import cpUpload0 from "../middleware/imageUpload.js";

const router = express.Router();

router
  .route("/createProduct")
  .post(isAuthenticated, authorizeAdmin, cpUpload0, createProduct);
router.route("/getallProduct").get(getAllProduct);
router.route("/getProductdetails/:id").get(getSingleProduct);
router
  .route("/updateProduct/:id")
  .put(isAuthenticated, authorizeAdmin,cpUpload0, updateProduct);
router
  .route("/deleteProduct/:id")
  .delete(isAuthenticated, authorizeAdmin, deleteProduct);
//categories Routes
router
  .route("/createCategory")
  .post(isAuthenticated, authorizeAdmin, createCategory);
router.route("/getCategory").get(getAllCategory);
router
  .route("/updateCategory/:id")
  .put(isAuthenticated, authorizeAdmin, updateCategory)
  .delete(isAuthenticated, authorizeAdmin, deleteCategory);

//SubCategory
router
  .route("/createSubCategory")
  .post(isAuthenticated, authorizeAdmin, CreateSubCategory);
router.route("/getsubCategory").get(getAllSubCategory);
router
  .route("/getSubcategory")
  .get(isAuthenticated, authorizeAdmin, getAllSubCategoryAdmin);

router
  .route("/updateSubcategorie/:id")
  .put(isAuthenticated, authorizeAdmin, updateSubCategory);
router
  .route("/deleteSubcategorie/:id")
  .delete(isAuthenticated, authorizeAdmin, deleteSubCategory);

  router.route("/addsize").post(addsize).get(getsize)

export default router;
