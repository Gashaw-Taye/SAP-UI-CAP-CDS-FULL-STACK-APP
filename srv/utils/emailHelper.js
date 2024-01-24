const nodemailer = require('nodemailer');

async function sendEmail(){
    
    const to = "gtforever2009@gmail.com"
    const subject = "just another test"
    const text = "another test content"

    const transporter = nodemailer.createTransport({
      host: 'mail.bernos.info',
      port: 465,
      secure: true,
      auth: {
        user: 'muluken@bernos.info',
        pass: '!baKyY7ue%e8',
      },
    });
  
  
    const mailOptions = {
      from: 'muluken@bernos.info',
      to,
      subject,
      text,
    };
  
    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info);
  
    } catch (error) {
      console.error('Error sending email: ', error);
    }
}
async function sendOtpEmail(reciever="gtforever2009@gmail.com", otp){
    
  const to = "gtforever2009@gmail.com"
  const subject = "Yout OTP Code"
  const text = `Your One time code is ${otp}`

  const transporter = nodemailer.createTransport({
    host: 'mail.bernos.info',
    port: 465,
    secure: true,
    auth: {
      user: 'muluken@bernos.info',
      pass: '!baKyY7ue%e8',
    },
  });


  const mailOptions = {
    from: 'muluken@bernos.info',
    to,
    subject,
    text,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info);

  } catch (error) {
    console.error('Error sending email: ', error);
  }
}
module.exports = { sendEmail, sendOtpEmail };