const nodemailer = require('nodemailer');

module.exports.sendMail = () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hello@example.com',
            pass: 'generated password'
        }
    });

    const mailOptions = {
        from: 'hello@example.com',
        to: 'reciever@gmail.com',
        subject: 'Subject',
        text: 'Email content'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}