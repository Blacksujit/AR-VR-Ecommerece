const { AppError } = require('../middleware/errorHandler');

const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return next(new AppError('Missing required fields: to, subject, html', 400));
    }

    if (!process.env.RESEND_API_KEY) {
      return res.json({
        success: true,
        message: 'Email queued (Resend not configured). Set RESEND_API_KEY to enable delivery.',
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@neoverse.store',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    res.json({ success: true, data: { id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendEmail };
