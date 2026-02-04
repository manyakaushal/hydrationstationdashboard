import nodemailer from 'nodemailer';

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'triston.oberbrunner95@ethereal.email',
        pass: 'qJwwVX4fwe8Nuue9sN',
      },
      family: 4, // force IPv4
    });

    const info = await transporter.sendMail({
      from: `"Hydration Station" <triston.oberbrunner95@ethereal.email>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}
