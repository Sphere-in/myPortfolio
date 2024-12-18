import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

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
      to: process.env.EMAIL_USER, // Or send it to a different email
      subject: subject || "No Subject",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
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

// import nodemailer from "nodemailer";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQeK0m75MT17b2Z9qF2WJQ03XAkOJiN_g",
//   authDomain: "portfolio-7d2ad.firebaseapp.com",
//   projectId: "portfolio-7d2ad",
//   storageBucket: "portfolio-7d2ad.firebasestorage.app",
//   messagingSenderId: "18538077113",
//   appId: "1:18538077113:web:51b71e26c2106aee017468",
//   measurementId: "G-4N5L8H2MHF"
// };

// // Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to save data to Firestore
// const saveSubmission = async (data) => {
//   try {
//     const docRef = await addDoc(collection(db, "Submissions"), data);
//     return docRef.id; // Return document ID
//   } catch (error) {
//     console.error("Error saving submission: ", error);
//     throw error;
//   }
// };

// export async function POST(req) {
//   try {
//     const { name, email, subject, message } = await req.json();

//     // Save the data in Firestore
//     const messageId = await saveSubmission({
//       name: name,
//       email: email,
//       subject: subject || "No Subject",
//       message: message,
//       timestamp: new Date().toISOString()
//     });
//     console.log("Document saved with ID: ", messageId);

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
//     return new Response(JSON.stringify({ success: true, messageId: messageId }), { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
//   }
// }
