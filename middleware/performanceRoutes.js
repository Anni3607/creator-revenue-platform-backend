const express = require("express");

const router = express.Router();

const performanceController = require("../controllers/performanceController");

const authenticateToken = require("../middleware/authMiddleware");

router.post(
  "/submit",
  authenticateToken,
  performanceController.submitPerformance
);

router.get(
  "/campaign/:campaignId",
  authenticateToken,
  performanceController.getCampaignPerformance
);

router.post(
 "/score/:creatorId",
 authenticateToken,
 performanceController.updateCreatorScore
);

module.exports = router;