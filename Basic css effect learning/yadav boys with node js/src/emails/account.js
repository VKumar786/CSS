const nodemailer = require('nodemailer');
const welcomeEmail = (email,user_name)=>{
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.HOST_PASS
        },
        tls:{
            rejectUnauthorized: false,
        }
    })

    let mailOption = {
        from: 'yadav11adu@gmail.com',
        to: `${email}`,
        subject: 'Thanks for joining in !',
        text: `welcome to the app, ${user_name}. Let me know how you get along with the app`,
    }

    transporter.sendMail(mailOption, function(error,success){
        if(error)  console.log(error);
        else console.log("Email is send success");
    })

}
const sendCancelationEmail = (email,user_name)=>{
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yadav11adu@gmail.com',
            pass: 'vs7241598'
        },
        tls:{
            rejectUnauthorized: false,
        }
    })

    let mailOption = {
        from: 'yadav11adu@gmail.com',
        to: `${email}`,
        subject: 'Sorry to see you !',
        text: `Goodbye, ${user_name}. I hope to see you back sometime soon..`,
    }

    transporter.sendMail(mailOption, function(error,success){
        if(error)  console.log(error);
        else console.log("Email is send success");
    })

}

module.exports = {
    welcomeEmail,
    sendCancelationEmail
}


// use dotenv npm to secure your password