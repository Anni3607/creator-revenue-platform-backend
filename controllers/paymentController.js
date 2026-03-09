const pool = require("../config/db");

/*
CREATE PAYMENT
*/
exports.createPayment = async (req, res) => {
  try {

    const { campaign_id, creator_id, amount } = req.body;

    const result = await pool.query(
      `INSERT INTO payments
      (campaign_id, creator_id, amount, status)
      VALUES ($1,$2,$3,'pending')
      RETURNING *`,
      [campaign_id, creator_id, amount]
    );

    res.status(201).json({
      message: "Payment created",
      payment: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create payment",
      error: error.message
    });

  }
};



/*
MARK PAYMENT AS PAID
*/
exports.markPaymentPaid = async (req, res) => {
  try {

    const { paymentId } = req.params;

    const result = await pool.query(
      `UPDATE payments
       SET status = 'paid', paid_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [paymentId]
    );

    res.json({
      message: "Payment marked as paid",
      payment: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update payment",
      error: error.message
    });

  }
};



/*
GET CAMPAIGN PAYMENTS
*/
exports.getCampaignPayments = async (req, res) => {
  try {

    const { campaignId } = req.params;

    const result = await pool.query(
      `SELECT
        payments.id,
        payments.amount,
        payments.status,
        payments.paid_at,
        creator_profiles.username
      FROM payments
      JOIN creator_profiles
      ON payments.creator_id = creator_profiles.user_id
      WHERE payments.campaign_id = $1`,
      [campaignId]
    );

    res.json({
      payments: result.rows
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message
    });

  }
};