import { Resend } from 'resend';
import { data } from './dataSaveFailed.js';
import { generateHTMLTable } from './utils/globalsFunctions.js';

// free plan
// Monthly Limit: 3,000
// Daily Limit: 100

const resend = new Resend(process.env.RESEND_API_KEY);

const htmlContent = generateHTMLTable(data);

const sendEmail = async ({ sender, emailList, subject, htmlContent }) => {
  try {
    const response = await resend.emails.send({
      from: sender,
      to: emailList,
      subject: subject,
      html: htmlContent,
    });

    console.log('response', response);
  } catch (error) {
    console.log('error', error);
  }
};

sendEmail({
  sender: 'Api Testing Team <onboarding@resend.dev>', // register domain
  emailList: ['santillanreynaarielangel@gmail.com'],
  subject: 'Failed test report',
  htmlContent: htmlContent,
});
