const nodemailer = require("nodemailer");

module.exports = sendMail = async ({ from , to ,subject , text ,html })=>{
    let transporter = nodemailer.createTransport({
        host : process.env.smtp_host,
        port : process.env.smtp_port,
        secure : false,
        auth : {
            user : process.env.Mail_user,
            pass : process.env.Mail_pass
        }

    });

    let info = await transporter.sendMail({
        from : `SameerDeveloper ${from}`,
        to,
        subject,
        text,
        html,

    })
}

