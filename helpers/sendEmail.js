import { Resend } from "resend";


const resend = new Resend('re_6s1WVT13_LTLiw9kuQ9b7boVhMqvjowiw');

export const sendEmail = async (to, text, html) => {
    try {
        const response = await resend.emails.send({
            from: process.env.RESEND_EMAIL,
            to,
            subject: 'BoiTech DC | Your Lab Report is Ready',
            text,
            html,
        });
        console.log("from resend",response)
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
