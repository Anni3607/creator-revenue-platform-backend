const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/campaignController");

const authenticateToken = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateToken,
  campaignController.createCampaign
);


router.get(
  "/all",
  authenticateToken,
  campaignController.getAllCampaigns
);

router.post(
  "/apply",
  authenticateToken,
  campaignController.applyToCampaign
);

router.get(
  "/applications/:campaignId",
  authenticateToken,
  campaignController.getCampaignApplications
);

router.patch(
  "/application/:id/status",
  authenticateToken,
  campaignController.updateApplicationStatus
);


module.exports = router;