const router = require("express").Router();
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" });
    }
    const decode = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(decode._id);
    if (!user) {
      return res.json({
        success: false,
        message: "unauthorized user access on logout route!",
      });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: "Sign out successfully!" });
  }
  // res.redirect("/")
});

module.exports = router;
