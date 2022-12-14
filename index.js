require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./conn/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const logoutRoutes = require("./routes/logout");
const verifyRoutes = require("./routes/verify");

const helmet = require("helmet");
const { User } = require("./models/user");
const { isAuth } = require("./middleware/isAuth");
// database connection
connection();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Using Helmet

app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
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
// app.use("/api/verify", verifyRoutes);
// app.use("/api/logout", isAuth, logoutRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port http://localhost:${port}`));

// db-advert
//u: dbUser
//p: dbUserPassword
