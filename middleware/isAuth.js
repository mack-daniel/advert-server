const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWTPRIVATEKEY);
      console.log(decode);
      // const user = await User.findOne({
      //   _id: decode._id,
      //   "tokens.token": token,
      // });
      const user = await User.findById(decode.userId);

      // console.log(user);

      if (!user) {
        return res.json({
          success: false,
          message: "unauthorized user access!",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({
          success: false,
          message: "unauthorized token access!",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "sesson expired try sign in!",
        });
      }

      res.json({ success: false, message: "Internal server error!" });
      console.log(error);
    }
  } else {
    res.json({ success: false, message: "unauthorized no token access!" });
  }
};
