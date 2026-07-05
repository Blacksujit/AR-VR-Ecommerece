const Contact = require('../models/Contact');
const { AppError } = require('../middleware/errorHandler');

const sendEmailNotification = async (contact) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend not configured. Skipping email notification.');
    return;
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@neoverse.store';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'notifications@neoverse.store',
        to: adminEmail,
        subject: `New Inquiry: ${contact.subject}`,
        html: `
          <h2>New Customer Inquiry</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${contact.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Subject</td><td style="padding:8px;border:1px solid #ddd;">${contact.subject}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #ddd;">${new Date(contact.createdAt).toLocaleString()}</td></tr>
          </table>
          <h3>Message:</h3>
          <p style="padding:12px;background:#f5f5f5;border-radius:4px;">${contact.message}</p>
        `,
      }),
    });
  } catch (error) {
    console.error('Failed to send email notification:', error.message);
  }
};

const sendAutoReply = async (contact) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'support@neoverse.store',
        to: contact.email,
        subject: 'We received your inquiry - NeoVerse Store',
        html: `
          <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
            <h2 style="color:#5B7FFF;">Thank you for contacting us, ${contact.name}!</h2>
            <p>We have received your inquiry regarding <strong>"${contact.subject}"</strong> and will get back to you within 24 hours.</p>
            <div style="padding:16px;background:#f8f9ff;border-radius:8px;margin:16px 0;">
              <p style="margin:0;"><strong>Your message:</strong></p>
              <p style="margin:8px 0 0 0;color:#555;">${contact.message}</p>
            </div>
            <p>In the meantime, feel free to browse our <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">product catalog</a>.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="color:#999;font-size:12px;">NeoVerse Store - The Future of Shopping</p>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error('Failed to send auto-reply:', error.message);
  }
};

const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      throw new AppError('All fields are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    const contact = await Contact.create({ name, email, subject, message });

    sendEmailNotification(contact);
    sendAutoReply(contact);

    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you soon.',
      data: { id: contact._id },
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const messages = await Contact.find().sort('-createdAt').skip((page - 1) * limit).limit(limit);
    const total = await Contact.countDocuments();
    res.json({ success: true, data: messages, pagination: { page, pages: Math.ceil(total / limit), total } });
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) throw new AppError('Message not found', 404);
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getMessages, markRead };
