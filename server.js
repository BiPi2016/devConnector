const express = require("express");
const connectDB = require('./config/db');

const userRoutes = require('./routes/api/user.js');
const authRoutes = require('./routes/api/auth.js');
const profileRoutes = require('./routes/api/profile.js');
const postRoutes = require('./routes/api/post.js');
//connecting to MongoDB
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use('/user/', userRoutes);
app.use('/auth/', authRoutes);
app.use('/profile/', profileRoutes);
app.use('/post/', postRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening at port ${port}`));