const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", ""); // in header when token comes from mobile  we remove space that is why replace and get token

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
// after decode token id from that id we get user from database
// req.user means at time of request we inject more information of user and send to next 
  req.user = await User.findById(decoded.id);

  next();
});
// we treat role as array that is why ..roles gives functionality of array
exports.customRole = (...roles) => {
  return (req, res, next) => {
    // req.user.role means at time of login role        if roles is not manager 
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not allowed for this resouce", 403));
    }
    next();
  };
};
