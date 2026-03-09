const pool = require("../config/db");

exports.createCampaign = async (req, res) => {
  try {

    const brandId = req.user.id;

    const {
      title,
      description,
      budget,
      deadline,
      target_platform
    } = req.body;

    const result = await pool.query(
      `INSERT INTO campaigns
      (brand_id, title, description, budget, deadline, target_platform, status)
      VALUES ($1,$2,$3,$4,$5,$6,'open')
      RETURNING *`,
      [brandId, title, description, budget, deadline, target_platform]
    );

    res.status(201).json({
      message: "Campaign created",
      campaign: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create campaign",
      error: error.message
    });

  }
};

exports.getAllCampaigns = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM campaigns WHERE status = 'open' ORDER BY deadline ASC"
    );

    res.json({
      campaigns: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch campaigns",
      error: error.message
    });

  }
};

exports.applyToCampaign = async (req, res) => {
  try {

    const creatorId = req.user.id;
    const { campaign_id } = req.body;

    const result = await pool.query(
      `INSERT INTO applications
      (campaign_id, creator_id, status, applied_at)
      VALUES ($1,$2,'pending',NOW())
      RETURNING *`,
      [campaign_id, creatorId]
    );

    res.status(201).json({
      message: "Application submitted",
      application: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to apply to campaign",
      error: error.message
    });

  }
};

exports.getCampaignApplications = async (req, res) => {
  try {

    const campaignId = req.params.campaignId;

    const result = await pool.query(
      `SELECT 
        applications.id,
        applications.status,
        applications.applied_at,
        creator_profiles.username,
        creator_profiles.followers,
        creator_profiles.engagement_rate,
        creator_profiles.category
      FROM applications
      JOIN creator_profiles
      ON applications.creator_id = creator_profiles.user_id
      WHERE applications.campaign_id = $1`,
      [campaignId]
    );

    res.json({
      applications: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });

  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {

    const applicationId = req.params.id;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, applicationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      message: "Application status updated",
      application: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update application",
      error: error.message
    });

  }
};