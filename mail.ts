import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Define email options
const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient-email@example.com',
  subject: 'Subject of your email',
  text: 'Body of your email',
  attachments: [
    {
      filename: 'newFileName.pdf',
      path: 'path/to/newFileName.pdf'
    }
  ]
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Email sent: ' + info.response);
});