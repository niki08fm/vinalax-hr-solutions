const { getPool, sql } = require('../config/database');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query('SELECT * FROM Services ORDER BY id');

    res.status(200).json({
      success: true,
      services: result.recordset
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get service by slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required' });
    }

    const pool = getPool();
    const result = await pool
      .request()
      .input('slug', sql.VarChar, slug)
      .query('SELECT * FROM Services WHERE slug = @slug');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      service: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
