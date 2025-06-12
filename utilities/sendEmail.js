const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (toEmail, username) => {
  try {
    const data = await resend.emails.send({
      from: 'iamadams4523@gmail.com',
      to: toEmail,
      subject: 'Reset Your Password',
      html: `
        <h3>Hello ${username},</h3>
        <p>We received a request to reset your password. If this was you, click below:</p>
        <a href="https://yourfrontend.com/reset-password">Reset Password</a>
      `,
    });

    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Email failed:', error);
    throw error;
  }
};

module.exports = sendResetEmail;
