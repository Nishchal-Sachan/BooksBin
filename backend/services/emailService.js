/**
 * Mock Email Service
 * In a real application, this would use SendGrid, AWS SES, or Nodemailer with SMTP.
 * For this implementation, we'll log emails to the console.
 */

const sendEmail = async (to, subject, html) => {
    console.log('----------------------------------------------------');
    console.log(`[MOCK EMAIL SERVICE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:`);
    console.log(html);
    console.log('----------------------------------------------------');
    return true;
};

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    const subject = 'Verify your email address';
    const html = `
    <h1>Welcome to BookStore!</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>If you didn't create an account, please ignore this email.</p>
  `;
    return sendEmail(email, subject, html);
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const subject = 'Reset your password';
    const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
    return sendEmail(email, subject, html);
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
