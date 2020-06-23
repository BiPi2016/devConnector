const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const app = express();
const userRoutes = require("./routes/api/user.js");
const authRoutes = require("./routes/api/auth.js");
const profileRoutes = require("./routes/api/profile.js");
const postRoutes = require("./routes/api/post.js");

//connecting to MongoDB
connectDB();

//Init middleware
app.use(
  express.json({
    extended: false,
  })
);
app.use(morgan("combined"));

app.get("/", (req, res, next) => {
  res.json("API running");
});
// Routes
app.use("/api/user/", userRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/profile/", profileRoutes);
app.use("/api/post/", postRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening at port ${port}`));
