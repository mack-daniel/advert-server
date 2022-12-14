const router = require("express").Router();
const { User, validate } = require("../models/user");
// const VerificationToken = require("../models/verificationToken");
// const { generateOTP } = require("../utils/mail");

const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/verificationToken");
const nodemailer = require("nodemailer");

// const { sendOTPVerificationEmail } = require("../utils/userOTPVerification");

// nodemailer stuff
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   // auth: {
//   //   user: process.env.AUTH_EMAIL,
//   //   pass: process.env.AUTH_PASSWORD,
//   // },
//   // host: "smtp.google.com",
//   // service: "gmail",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.AUTH_EMAIL, // generated ethereal user
//     pass: process.env.AUTH_PASSWORD, // generated ethereal password
//   },
//   // tls: {
//   //   rejectUnauthorized: false,
//   // },
// });

// // testing success
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Ready for messages");
//     console.log(success);
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // const OTP = generateOTP();
    // const verificationToken = new VerificationToken({
    //   owner: newUser._id,
    //   token: OTP,
    // });
    // console.log(OTP);
    // await verificationToken.save();

    await new User({ ...req.body, password: hashPassword }).save();

    // const newUser = new User({
    //   ...req.body,
    //   password: hashPassword,
    //   verified: false,
    // });

    // newUser
    //   .save()
    //   .then((result) => {
    //     sendOTPVerificationEmail(result, res);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     res.json({
    //       status: "FAILED",
    //       message: "An error occured while saving user account",
    //     });
    //   });
    // .then((result) => {
    //   sendOTPVerificationEmail(result, res);
    // });

    let data = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    res.status(201).send({
      message: "User created successfully",
      status: res.statusCode,
      data,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete</p>
      <p>This code <b>expires in 1 hour </b></p>`,
    };

    // hash otp
    const saltRounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 360000,
    });
    // save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = router;
