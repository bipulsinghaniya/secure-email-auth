const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif; max-width:400px; margin:auto; padding:20px;">
        <h2 style="color:#6366f1;">Email Verification</h2>
        <p>Your one-time password is:</p>
        <h1 style="letter-spacing:8px; color:#a855f7; text-align:center;">${otp}</h1>
        <p style="color:#888;">This code expires in <strong>10 minutes</strong>.</p>
      </div>
    `,
  });
};

module.exports = sendEmail;
