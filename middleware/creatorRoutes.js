const express = require("express");

const router = express.Router();

const creatorController = require("../controllers/creatorController");

const authenticateToken = require("../middleware/authMiddleware");


/*
CREATE PROFILE
*/
router.post(
  "/profile",
  authenticateToken,
  creatorController.createProfile
);


/*
GET PROFILE
*/
router.get(
  "/profile",
  authenticateToken,
  creatorController.getProfile
);

router.get(
  "/top",
  authenticateToken,
  creatorController.getTopCreators
);

module.exports = router;