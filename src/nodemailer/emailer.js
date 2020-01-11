const nodeMailer = require("nodemailer");
const { EMAIL_PASSWORD } = require("../config");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dream.log.service@gmail.com",
    pass: EMAIL_PASSWORD
  }
});

let layout = "";
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "src/nodemailer/templates/",
    layoutsDir: "src/nodemailer/templates/",
    defaultLayout: layout
  },
  viewPath: "src/nodemailer/templates/",
  extName: ".hbs"
};

transporter.use("compile", hbs(handlebarOptions));

const sendEmails = {
  sendEmailInitialVerification: function(req, res) {
    layout = "initial-verification.hbs";
    const { verification_code, email } = req;
    let mailOptions = {
      from: '"Dream.log" dream.log.service@gmail.com',
      to: email,
      subject: "Verify your email address",
      text: "Email from Dream.log",
      template: "initial-verification",
      context: { verification_code }
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  },
  sendEmailChangeEmail: function(req, res) {
    layout = "change-email.hbs";
    const { verification_code, email } = req;
    let mailOptions = {
      from: '"Dream.log" dream.log.service@gmail.com',
      to: email,
      subject: "Verify your new email address",
      text: "Email from Dream.log",
      template: "change-email",
      context: { verification_code }
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  },
  sendEmailResetPassword: function(req, res) {
    layout = "reset-password.hbs";
    const { token, email } = req;
    let mailOptions = {
      from: '"Dream.log" dream.log.service@gmail.com',
      to: email,
      subject: "Reset Password",
      text: "Email from Dream.log",
      template: "reset-password",
      context: { token }
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  }
};

module.exports = sendEmails;
