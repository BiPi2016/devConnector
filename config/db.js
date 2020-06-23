const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

const connectDB = async () => {
    try {
        await mongoose.connect(db, options);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Database connection error');
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;