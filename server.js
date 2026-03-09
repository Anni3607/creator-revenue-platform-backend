require("dotenv").config();
 const campaignRoutes = require("./routes/campaignRoutes");

const brandRoutes = require("./routes/brandRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const creatorRoutes = require("./routes/creatorRoutes");   // NEW

const pool = require("./config/db");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

const performanceRoutes = require("./routes/performanceRoutes");

app.use(cors());
app.use(express.json());

/*
TEST DATABASE CONNECTION
*/
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Backend and Database Connected",
      time: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

/*
AUTH ROUTES
*/
app.use("/api/auth", authRoutes);

/*
CREATOR ROUTES
*/
app.use("/api/creator", creatorRoutes);  
app.use("/api/brand", brandRoutes); 
app.use("/api/campaign", campaignRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/payment", paymentRoutes);// NEW

/*
PROTECTED TEST ROUTE
*/
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

