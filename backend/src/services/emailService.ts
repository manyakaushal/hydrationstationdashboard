import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // make sure this is first

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // TLS not required for Ethereal
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Demo Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('Email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

