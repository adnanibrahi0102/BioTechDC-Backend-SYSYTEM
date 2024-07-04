import twilio from 'twilio';

export const sendSMS = async (to, body) => {
  const client = twilio(process.env.Account_SID_KEY, process.env.Auth_Token_KEY);

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`SMS sent successfully to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`Error sending SMS to ${to}: ${error.message}`);
    throw error;
  }
};
