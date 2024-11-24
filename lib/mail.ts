import nodemailer from "nodemailer";

const from = process.env.EMAIL_USERNAME;

const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { status: 200, message: "Email sent!" };
  } catch (err) {
    console.error("SEND EMAIL", err);

    return { status: 500, error: "Something went wrong try again!" };
  }
};
