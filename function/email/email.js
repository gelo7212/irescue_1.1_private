var nodeMailer = require('nodemailer');

function createRandomKey(){
    let r = Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4);
    console.log(r.toUpperCase());
    return r
}
  let transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'eddie.lehner@ethereal.email',
            pass: 'P8mReyMednDk2gzK8D'
        }
    });

  // send mail with defined transport object
function sendEmail(from,to,subject,text,html){


var mailOptions = {
    from:from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  };
  
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = {sendEmail,createRandomKey}