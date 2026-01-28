import { sendEmail } from './emailservice';

const runDemo = async () => {
  await sendEmail(
    'anyone@example.com', // doesn’t matter for Ethereal
    'Demo Email from Hydration Station',
    'Hello! This is a demo email sent from our TypeScript backend.'
  );
};

runDemo();
