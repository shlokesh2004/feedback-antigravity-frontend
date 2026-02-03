const Feedback = require("../models/Feedback");

// Create new feedback
const createFeedback = async (req, res) => {
    try {
        const { name, email, message, rating, feedbackType } = req.body;

        // Basic validation
        if (!name || !email || !message || !rating || !feedbackType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const feedback = await Feedback.create({
            name,
            email,
            message,
            rating,
            feedbackType
        });

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get feedback stats
const getFeedbackStats = async (req, res) => {
    try {
        const total = await Feedback.countDocuments();

        const ratings = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const avgRating = ratings.length > 0 ? parseFloat(ratings[0].avgRating.toFixed(1)) : 0;

        const typeCounts = await Feedback.aggregate([
            { $group: { _id: "$feedbackType", count: { $sum: 1 } } }
        ]);

        const formattedTypeCounts = typeCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({
            total,
            avgRating,
            typeCounts: formattedTypeCounts
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createFeedback, getFeedbackStats };
