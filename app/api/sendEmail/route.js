// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     const { name, email, subject, message } = await req.json();

//     // Create a transporter with your email credentials
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Define the email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER, // Or send it to a different email
//       subject: subject || "No Subject",
//       text: `You have a new message from ${name} (${email}):\n\n${message}`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     // Return success response
//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("Email sending error:", error);
//     return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
//   }
// }

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message, to } = await req.json();

    // Create a transporter with your email credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to || process.env.EMAIL_USER, // Send to the specified recipient or default to admin email
      subject: subject || "No Subject",
      text: `Message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

