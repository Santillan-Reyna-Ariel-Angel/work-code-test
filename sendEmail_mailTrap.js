// MailTrap Plan Free (using SMTP):
// 1000 emails / month
// 200 emails / day
// 1 sending domain

import nodemailer from 'nodemailer';
import { data } from './dataSaveFailed.js';
import {
  generateHTMLTable,
  sendEmailWithRetry,
} from './utils/globalsFunctions.js';

// Generate the HTML table
const htmlContent = generateHTMLTable(data);

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'd44406b6a0ee3c',
    pass: '29670b53b8316b',
  },
});

const mailOptions = {
  from: 'prueba@tudominio.com',
  to: 'destinatario@ejemplo.com',
  subject: 'Test email with Mailtrap and HTML Table',
  text: 'Hello AS. This email was sent from Node.js and arrived at Mailtrap',
  html: htmlContent, // Add the HTML content
};

// Start the sending process with 3 attempts
sendEmailWithRetry({ transport, mailOptions });
