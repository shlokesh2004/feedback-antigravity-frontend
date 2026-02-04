const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ["https://feedbackfloww.netlify.app", "http://localhost:5000", "http://127.0.0.1:5000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/feedback", feedbackRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Antigravity Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
