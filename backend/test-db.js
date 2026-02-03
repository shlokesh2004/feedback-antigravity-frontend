const mongoose = require("mongoose");

// Hardcoded URI to rule out .env issues
const uri = "mongodb+srv://antigravityuser:feedback@feedback.g94qihu.mongodb.net/?appName=feedback";

console.log("Attempting to connect with hardcoded URI...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("SUCCESS: MongoDB Connected!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("FAILURE: Connection Failed.");
        console.error("Code:", err.code);
        console.error("CodeName:", err.codeName);
        console.error("Message:", err.message);
        process.exit(1);
    });
