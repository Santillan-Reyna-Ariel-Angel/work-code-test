import brevo from '@getbrevo/brevo';

let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY_EMAIL;

const sendEmail = async () => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Failed test report';
    sendSmtpEmail.to = [
      { email: 'santillanreynaarielangel@gmail.com', name: 'Ariel Santillan' },
    ];

    sendSmtpEmail.htmlContent =
      '<html><body><h1>Common: This is my first transactional email</h1></body></html>';

    sendSmtpEmail.sender = {
      name: 'App node',
      email: 'santillanreynaarielangel1@gmail.com',
    };

    sendSmtpEmail.replyTo = {
      name: 'Ariel Santillan 1',
      email: 'santillanreynaarielangel1@gmail.com',
    };
    // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
    // sendSmtpEmail.params = {
    //   parameter: 'My param value',
    //   subject: 'common subject',
    // };

    let result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('result', result);
  } catch (error) {
    console.log('error', error);
  }
};

sendEmail();
