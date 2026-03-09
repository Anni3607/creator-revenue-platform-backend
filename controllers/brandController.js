const pool = require("../config/db");

/*
CREATE BRAND PROFILE
*/
exports.createBrandProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      company_name,
      industry,
      website,
      description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO brand_profiles
      (user_id, company_name, industry, website, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [userId, company_name, industry, website, description]
    );

    res.status(201).json({
      message: "Brand profile created",
      profile: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create brand profile",
      error: error.message
    });

  }
};


/*
GET BRAND PROFILE
*/
exports.getBrandProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM brand_profiles WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Brand profile not found"
      });
    }

    res.json({
      profile: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch brand profile",
      error: error.message
    });

  }
};


exports.getCampaignAnalytics = async (req, res) => {
  try {

    const { campaignId } = req.params;

    const result = await pool.query(
      `SELECT
        SUM(views) as total_views,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        AVG(engagement_rate) as avg_engagement
      FROM campaign_performance
      WHERE campaign_id = $1`,
      [campaignId]
    );

    res.json({
      campaign_id: campaignId,
      analytics: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message
    });

  }
};