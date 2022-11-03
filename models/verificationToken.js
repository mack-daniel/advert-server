const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");

const UserOTPVerificationSchema = new Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiredAt: Date,
});

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

module.exports = UserOTPVerification;

// // const verificationTokenSchema = new mongoose.Schema({
// //   owner: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: true,
// //   },
// //   token: {
// //     type: String,
// //     required: true,
// //   },
// //   createdAt: {
// //     type: Date,
// //     expires: 3600,
// //     default: Date.now(),
// //   },
// // });

// // verificationTokenSchema.pre("save", async function (next) {
// //   if (this.isModified("token")) {
// //     const hash = await bcrypt.hash(this.token, 8);
// //     this.token = hash;
// //   }
// //   next();
// // });

// // verificationTokenSchema.methods.comparedToken = async function (token) {
// //   const result = await bcrypt.compareSync(token, this.token);
// //   return result;
// // };

// // module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
