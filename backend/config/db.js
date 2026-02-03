const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error Details:");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("CodeName:", err.codeName);
        process.exit(1);
    }
};

module.exports = connectDB;
