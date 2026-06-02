const { getPool, sql } = require('../config/database');

// Create or update user and create booking
exports.createBooking = async (req, res) => {
  try {
    const { name, phone, email, company, serviceInterested, preferredDate, preferredTime, message } = req.body;

    // Validation
    if (!name || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const pool = getPool();

    // Check if user exists or create new
    let userId;
    const userCheck = await pool
      .request()
      .input('phone', sql.VarChar, phone)
      .query('SELECT id FROM Users WHERE phone = @phone');

    if (userCheck.recordset.length > 0) {
      userId = userCheck.recordset[0].id;
      // Update user info
      await pool
        .request()
        .input('id', sql.Int, userId)
        .input('name', sql.VarChar, name)
        .input('email', sql.VarChar, email || null)
        .input('company', sql.VarChar, company || null)
        .input('updatedAt', sql.DateTime, new Date())
        .query('UPDATE Users SET name = @name, email = @email, company = @company, updatedAt = @updatedAt WHERE id = @id');
    } else {
      // Create new user
      const userResult = await pool
        .request()
        .input('name', sql.VarChar, name)
        .input('phone', sql.VarChar, phone)
        .input('email', sql.VarChar, email || null)
        .input('company', sql.VarChar, company || null)
        .query('INSERT INTO Users (name, phone, email, company) OUTPUT INSERTED.id VALUES (@name, @phone, @email, @company)');
      userId = userResult.recordset[0].id;
    }

    // Check if slot is available
    const slotCheck = await pool
      .request()
      .input('date', sql.Date, preferredDate)
      .input('time', sql.VarChar, preferredTime)
      .query('SELECT id, isBooked FROM AvailableSlots WHERE slotDate = @date AND slotTime = @time');

    if (slotCheck.recordset.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected slot not available' });
    }

    if (slotCheck.recordset[0].isBooked) {
      return res.status(400).json({ success: false, message: 'Slot already booked' });
    }

    const slotId = slotCheck.recordset[0].id;

    // Create booking
    const bookingResult = await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('preferredDate', sql.Date, preferredDate)
      .input('preferredTime', sql.VarChar, preferredTime)
      .input('serviceInterested', sql.VarChar, serviceInterested || null)
      .input('message', sql.VarChar, message || null)
      .query(`
        INSERT INTO Bookings (userId, preferredDate, preferredTime, serviceInterested, message, status)
        OUTPUT INSERTED.id, INSERTED.createdAt
        VALUES (@userId, @preferredDate, @preferredTime, @serviceInterested, @message, 'Confirmed')
      `);

    // Mark slot as booked
    await pool
      .request()
      .input('slotId', sql.Int, slotId)
      .query('UPDATE AvailableSlots SET isBooked = 1 WHERE id = @slotId');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      booking: {
        bookingId: bookingResult.recordset[0].id,
        date: preferredDate,
        time: preferredTime,
        bookedAt: bookingResult.recordset[0].createdAt
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available dates
exports.getAvailableDates = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query('SELECT DISTINCT slotDate FROM AvailableSlots WHERE isBooked = 0 AND slotDate >= CAST(GETDATE() AS DATE) ORDER BY slotDate');

    res.status(200).json({
      success: true,
      dates: result.recordset.map(r => r.slotDate)
    });
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available times for a specific date
exports.getAvailableTimes = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const pool = getPool();
    const result = await pool
      .request()
      .input('date', sql.Date, date)
      .query('SELECT slotTime FROM AvailableSlots WHERE slotDate = @date AND isBooked = 0 ORDER BY slotTime');

    res.status(200).json({
      success: true,
      times: result.recordset.map(r => r.slotTime)
    });
  } catch (error) {
    console.error('Error fetching times:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query(`
        SELECT 
          b.id,
          b.userId,
          u.name,
          u.phone,
          u.company,
          b.serviceInterested,
          b.preferredDate,
          b.preferredTime,
          b.status,
          b.message,
          b.createdAt
        FROM Bookings b
        JOIN Users u ON b.userId = u.id
        ORDER BY b.createdAt DESC
      `);

    res.status(200).json({
      success: true,
      bookings: result.recordset
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
