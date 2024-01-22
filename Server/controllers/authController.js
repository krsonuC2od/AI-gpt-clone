const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");
// JWT token
exports.sendToken = (user, res, statusCode) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    token,
  });
};

// user-register Controller
exports.registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    //existing user
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return next(new errorResponse("Email is already register", 500));
    }
    const user = await userModel.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//user login controller
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation input
    if (!email || !password) {
      return next(new errorResponse("Please provide email or password"));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new errorResponse("Invalid credentials", 401));
    }
    const isMatch = await userModel.matchPassword(password);
    if (!isMatch) {
      return next(new errorResponse("Invalid credentials", 401));
    }
    //res
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logout Succesfully",
  });
};