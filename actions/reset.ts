"use server";

import React from "react";
import transporter from "@/lib/nodemailer";
import { render } from "@react-email/components";
import Email from "@/packages/transactional/emails/email";

export async function sendEmailAction({
  to,
  subject,
  description,
  link,
}: {
  to: string;
  subject: string;
  description: string;
  link: string;
}) {
  const emailHtml = await render(
    React.createElement(Email, { description, link, subject }),
  );
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `Clerkwise AI - ${subject}`,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// `
//     <div style="${styles.container}">
//       <h1 style="${styles.heading}">${subject}</h1>
//       <p style="${styles.paragraph}">${meta.description}</p>
//       <a href="${meta.link}" style="${styles.link}">Click Here</a>
//     </div>
//     `,
