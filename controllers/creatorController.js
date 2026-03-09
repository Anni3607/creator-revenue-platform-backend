const pool = require("../config/db");

/*
CREATE CREATOR PROFILE
*/
exports.createProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      username,
      platform,
      followers,
      engagement_rate,
      category,
      bio
    } = req.body;

    const result = await pool.query(
      `INSERT INTO creator_profiles
      (user_id, username, platform, followers, engagement_rate, category, bio)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [userId, username, platform, followers, engagement_rate, category, bio]
    );

    res.status(201).json({
      message: "Creator profile created",
      profile: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create creator profile",
      error: error.message
    });

  }
};


/*
GET CREATOR PROFILE
*/
exports.getProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM creator_profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Creator profile not found"
      });
    }

    res.json({
      profile: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch creator profile",
      error: error.message
    });

  }
};


/*
TOP CREATORS LEADERBOARD
*/
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