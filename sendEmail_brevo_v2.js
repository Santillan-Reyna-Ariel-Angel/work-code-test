import brevo from '@getbrevo/brevo';
let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY_EMAIL;

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

sendSmtpEmail.subject = 'My {{params.subject}}';
sendSmtpEmail.htmlContent =
  '<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>';
sendSmtpEmail.sender = {
  name: 'Ariel 1',
  email: 'santillanreynaarielangel1@gmail.com',
};
sendSmtpEmail.to = [
  { email: 'santillanreynaarielangel@gmail.com', name: 'Ariel Santillan' },
];
sendSmtpEmail.replyTo = {
  email: 'santillanreynaarielangel1@gmail.com',
  name: 'Ariel 1',
};
// sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
// sendSmtpEmail.params = {
//   parameter: 'My param value',
//   subject: 'common subject',
// };

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      'API called successfully. Returned data: ' + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);
