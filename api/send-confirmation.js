const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  try {
    await resend.emails.send({
      from: 'Your Tradie <onboarding@resend.dev>',
      to: email,
      subject: "You're on the Your Tradie waitlist! 🛠️",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0D1B2A; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #F4822A; font-size: 28px; margin-bottom: 8px;">Your Tradie</h1>
          <hr style="border-color: #F4822A; margin-bottom: 24px;" />
          <h2 style="font-size: 20px;">G'day ${name}! 👋</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
            You're on the list! We'll let you know the moment Your Tradie launches in your area.
          </p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
            No lead fees. No dodgy middlemen. Just tradies and homeowners connecting directly.
          </p>
          <div style="margin-top: 32px; padding: 16px; background: rgba(244,130,42,0.1); border-radius: 8px; border: 1px solid rgba(244,130,42,0.3);">
            <p style="margin: 0; color: #F4822A; font-weight: bold;">Stay tuned — we're building something good. 🔨</p>
          </div>
          <p style="margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.3);">© 2025 Your Tradie · Australia</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message });
  }
};
