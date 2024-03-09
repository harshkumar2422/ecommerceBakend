import express from "express";
import {
  changeRole,
  createOrder,
  deleteOrder,
  deleteUSer,
  forgetpassword,
  getallMyorder,
  getallOrders,
  getallUser,
  getmyProfile,
  login,
  logout,
  register,
  resetPasword,
  singleOrder,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";
import { checkout } from "../controllers/Payment.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getmyProfile);
router.route("/updateProfile").get(isAuthenticated, updateProfile);
router.route("/updatePassword").get(isAuthenticated, updatePassword);
router.route("/forgetPassword").post(forgetpassword);
router.route("/resetPassword").post(resetPasword);
//create Orders
router.route("/createOrder").post(isAuthenticated, createOrder);
router.route("/getallmyorder").get(isAuthenticated, getallMyorder);
router.route("/getallorder").get(isAuthenticated, authorizeAdmin, getallOrders);

//payment
router.route("/create-checkout-session").post(isAuthenticated, checkout);

router
  .route("/singleOrder/:id")
  .get(isAuthenticated, authorizeAdmin, singleOrder)
  .delete(isAuthenticated, deleteOrder);
router.route("/myOrder/:id").get(isAuthenticated, singleOrder);

//admins routes
router.route("/users").get(getallUser);
router
  .route("/user/:id")
  .put(isAuthenticated, authorizeAdmin, changeRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUSer);

export default router;
