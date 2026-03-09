const express = require("express");

const router = express.Router();

const brandController = require("../controllers/brandController");

const authenticateToken = require("../middleware/authMiddleware");


router.post(
  "/profile",
  authenticateToken,
  brandController.createBrandProfile
);

router.get(
  "/profile",
  authenticateToken,
  brandController.getBrandProfile
);
 router.get(
  "/analytics/:campaignId",
  authenticateToken,
  brandController.getCampaignAnalytics
);

module.exports = router;