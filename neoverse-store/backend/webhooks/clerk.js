const User = require('../models/User');

const handler = async (req, res) => {
  const payload = req.body;
  const { type, data } = payload;

  try {
    switch (type) {
      case 'user.created': {
        const email = data.email_addresses?.[0]?.email_address;
        if (!email) return res.status(400).json({ success: false, message: 'No email provided' });

        await User.create({
          clerkId: data.id,
          name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User',
          email,
          avatar: data.image_url || '',
          role: 'user',
        });

        console.log(`User created: ${email}`);
        break;
      }

      case 'user.updated': {
        const user = await User.findOne({ clerkId: data.id });
        if (user) {
          user.name = [data.first_name, data.last_name].filter(Boolean).join(' ') || user.name;
          user.avatar = data.image_url || user.avatar;
          const email = data.email_addresses?.[0]?.email_address;
          if (email) user.email = email;
          await user.save();
          console.log(`User updated: ${user.email}`);
        }
        break;
      }

      case 'user.deleted': {
        await User.deleteOne({ clerkId: data.id });
        console.log(`User deleted: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { webhookHandler: handler };
