const pool = require("../config/db");

exports.submitPerformance = async (req, res) => {
  try {

    const creatorId = req.user.id;

    const {
      campaign_id,
      post_url,
      views,
      likes,
      comments
    } = req.body;

    const engagement_rate = ((likes + comments) / views) * 100;

    const result = await pool.query(
      `INSERT INTO campaign_performance
      (campaign_id, creator_id, post_url, views, likes, comments, engagement_rate)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        campaign_id,
        creatorId,
        post_url,
        views,
        likes,
        comments,
        engagement_rate
      ]
    );

    res.status(201).json({
      message: "Performance submitted",
      performance: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to submit performance",
      error: error.message
    });

  }
};

exports.getCampaignPerformance = async (req, res) => {
  try {

    const campaignId = req.params.campaignId;

    const result = await pool.query(
      `SELECT
        campaign_performance.id,
        campaign_performance.views,
        campaign_performance.likes,
        campaign_performance.comments,
        campaign_performance.engagement_rate,
        campaign_performance.post_url,
        creator_profiles.username
      FROM campaign_performance
      JOIN creator_profiles
      ON campaign_performance.creator_id = creator_profiles.user_id
      WHERE campaign_performance.campaign_id = $1`,
      [campaignId]
    );

    res.json({
      results: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch performance",
      error: error.message
    });

  }
};

exports.updateCreatorScore = async (req, res) => {
  try {

    const creatorId = req.params.creatorId;

    const performance = await pool.query(
      `SELECT AVG(engagement_rate) as avg_engagement
       FROM campaign_performance
       WHERE creator_id = $1`,
      [creatorId]
    );

    const avgEngagement = performance.rows[0].avg_engagement || 0;

    const performanceScore = avgEngagement * 10;
    const reliabilityScore = 80;
    const totalScore = performanceScore * 0.7 + reliabilityScore * 0.3;

    const result = await pool.query(
      `INSERT INTO creator_scores
      (creator_id, performance_score, reliability_score, total_score)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (creator_id)
      DO UPDATE SET
      performance_score = $2,
      reliability_score = $3,
      total_score = $4
      RETURNING *`,
      [creatorId, performanceScore, reliabilityScore, totalScore]
    );

    res.json({
      message: "Creator score updated",
      score: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update creator score",
      error: error.message
    });

  }
};



exports.getTopCreators = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT
        creator_profiles.username,
        creator_profiles.followers,
        creator_scores.total_score
      FROM creator_scores
      JOIN creator_profiles
      ON creator_scores.creator_id = creator_profiles.user_id
      ORDER BY creator_scores.total_score DESC
      LIMIT 10`
    );

    res.json({
      creators: result.rows
    });


  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: error.message
    });

  }
};