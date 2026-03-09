const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

const authenticateToken = require("../middleware/authMiddleware");


router.post(
  "/create",
  authenticateToken,
  paymentController.createPayment
);


router.patch(
  "/pay/:paymentId",
  authenticateToken,
  paymentController.markPaymentPaid
);


router.get(
  "/campaign/:campaignId",
  authenticateToken,
  paymentController.getCampaignPayments
);

module.exports = router;