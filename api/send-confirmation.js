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
      reply_to: 'yourtradie.au@gmail.com',
      to: email,
      subject: `You're on the Your Tradie Waitlist!`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px;">
          <p>Congratulations, ${name}!</p>
          <p>You're on the list. We'll let you know the moment Your Tradie launches.</p>
          <p>No lead fees. No middlemen. Just tradies and homeowners connecting directly.</p>
          <p><strong>Building Australia's Largest Tradie Network.</strong></p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message });
  }
};