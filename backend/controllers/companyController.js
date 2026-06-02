const { getPool, sql } = require('../config/database');

// Get company info
exports.getCompanyInfo = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query('SELECT * FROM CompanyInfo WHERE id = 1');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Company info not found' });
    }

    res.status(200).json({
      success: true,
      company: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
