const nodemailer = require("nodemailer");

const sendEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click the link below:</p>
      <a href="${link}">Verify Email</a>
      <p>This link expires in 10 minutes.</p>
    `
  });
};

module.exports = sendEmail;
