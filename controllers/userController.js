import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/userModels.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Order from "../models/order.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new ErrorHandler("please enter all fields", 400));
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User already exist ", 400));
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    sendToken(user, 201, res, "user created successfully");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler("please enter all fields", 400));
    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(new ErrorHandler("user is not exist please Sign up", 404));
    const comparePAssword = await bcrypt.compare(password, user.password);
    if (!comparePAssword)
      return next(
        new ErrorHandler("please enter correct email and password", 400)
      );
    sendToken(user, 200, res, `welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        // expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const getmyProfile = async (req, res, next) => {
  const user = await User.findById(req.user);
  // if (!user) return next(new ErrorHandler("user is not logged in", 400))
  res.status(200).json({
    success: true,
    user,
  });
};

export const getallUser = async (req, res, next) => {
  try {
    const user = await User.find();

    if (!user) return next(new ErrorHandler("Users does not found", 404));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const changeRole = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("user doesnt exist", 400));

  if (user.role === "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }
  await user.save();
  res.status(200).json({
    success: true,
    messgae: "user role updated",
    user,
  });
};

export const deleteUSer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("user doesnt exist", 400));
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Inernal server Error", 500));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user);
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    await user.save();
    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { Oldpassword, newPassword } = req.body;
    const user = await User.findById(req.user).select("+password");
    if (!Oldpassword || !newPassword)
      return next(new ErrorHandler("Please Enter all Password", 400));
    const isMatch = await bcrypt.compare(Oldpassword, user.password);
    if (!isMatch) return next(new ErrorHandler("password is incorrect", 400));

    if (newPassword)
      user.password = bcrypt.hashSync(newPassword, 10) || user.password;

    await user.save();
    res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const forgetpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("please enter your email", 400));
    const user = await User.findOne({ email });
    if (!user)
      return next(
        new ErrorHandler("You are not a User plese register your account", 400)
      );
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "web.nucleas@gmail.com",
        pass: "jwunsrjmxrvqqjid",
      },
    });
    let mailOptions;
    mailOptions = {
      from: "web.nucleas@gmail.com",
      to: req.body.email,
      subject: "Forget password verification",
      text: `Your Account Verification Code is ${otp}`,
    };
    let info = await transporter.sendMail(mailOptions);
    if (info) {
      let otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      const updated = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: otp,
            otpExpiration: otpExpiration,
          },
        },
        { new: true }
      );
      if (updated) {
        res.status(201).json({
          success: true,
          message: "otp sent to your email successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Ivalid error",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Error", 500));
  }
};

export const resetPasword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassowrd } = req.body;
    if (!otp || !password || !confirmPassowrd)
      return next(new ErrorHandler("please eneter all fields"));
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(
        new ErrorHandler("User not exist plesase register your account", 400)
      );
    if (user.otp !== otp || user.otpExpiration < Date.now())
      return next(new ErrorHandler("inavlid otp", 400));
    if (password !== confirmPassowrd)
      return next(
        new ErrorHandler("password and confirmPassword are not same")
      );
    user.password = bcrypt.hashSync(password, 10) || user.password;
    (user.otp = ""), (user.otpExpiration = ""), user.save();
    res.status(200).json({
      success: true,
      message: "password has been changed you may login",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server Eror", 500));
  }
};

// orders controller start here

export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;
    if(!orderItems,
      !shippingAddress,
      !paymentMethod,
      !itemsPrice,
      !shippingPrice,
      !taxPrice,
      !totalPrice) return next( new ErrorHandler("enter all fields"))

    const orderCreate = await Order.create({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      orderCreate,
    });
  } catch (error) {
    next(new ErrorHandler("Internal server Error", 500));
    console.log(error);
  }
};

export const singleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler("cant find order ", 400));
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler("Internal server Error", 500));
    console.log(error);
  }
};

export const getallMyorder = async (req, res, next) => {
  try {
    const user = req.user;
    const order = await Order.findOne({ user });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler("Internal server Error", 500));
    console.log(error);
  }
};
export const getallOrders = async (req, res, next) => {
  try {
    const order = await Order.find({})
    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    console.log(error);
  }
}
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new ErrorHandler("not found order", 404))
    await order.deleteOne()
    res.status(200).json({
      success: true,
      message :"Deleted successfully"
    })
  } catch (error) {
    console.log(error);
  }
}

//add to cart
// export const addtocart = async (req, res, next) => {
//   const user = req.user;
//   const cart = await Cart.findById(user)
//   const { productId, quantity, price } = req.body;
//   if (!productId, quantity, price) return next(new ErrorHandler("please enter all fields", 404))
//   if (!cart) {
    
//   }
// }
