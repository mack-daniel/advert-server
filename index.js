require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./conn/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const { User } = require("./models/user");
// database connection
connection();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// routes
app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.send(user);
  } catch (error) {
    res.json({ message: error });
  }
});

// update users info
app.patch("/api/users/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, update, options);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port http://localhost:${port}`));

// db-advert
//u: dbUser
//p: dbUserPassword
