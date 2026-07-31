import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"GGU Counselling" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });


    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

export default sendEmail;