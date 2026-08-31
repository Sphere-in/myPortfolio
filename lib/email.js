import "server-only"
import nodemailer from "nodemailer"

export async function sendPortfolioEmail({ to, replyTo, subject, text }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return { skipped: true }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
  await transporter.sendMail({
    from: `Portfolio <${process.env.EMAIL_USER}>`,
    to: to || process.env.EMAIL_USER,
    replyTo,
    subject,
    text,
  })
  return { skipped: false }
}
