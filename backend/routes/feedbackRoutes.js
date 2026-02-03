const express = require("express");
const router = express.Router();

const { createFeedback, getFeedbackStats } = require("../controllers/feedbackController");

// POST /api/feedback
router.post("/", createFeedback);

// GET /api/feedback/stats
router.get("/stats", getFeedbackStats);

module.exports = router;
