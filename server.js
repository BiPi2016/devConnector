const express = require("express");
const connectDB = require('./config/db');

//connecting to MongoDB
connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening at port ${port}`));