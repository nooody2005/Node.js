const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    // //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    //   // Activate in gmail "less seecure app" option
    // });


    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 10000,
      debug: true,
      logger: true
    });

    // 2) Define the email options 
    const mailOptions = {
        from: 'Nada Hashem <hello@ByteShadow .io>',
        to : options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }

    //3) Actually send the email
    // await transporter.sendMail(mailOptions);

    console.log('🚀 before sending email');
    await transporter.sendMail(mailOptions);
    console.log('✅ email sent');

};

module.exports = sendEmail;