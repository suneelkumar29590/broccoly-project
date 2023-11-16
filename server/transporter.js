const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'broccoly09@gmail.com',
    pass: 'M30J26Y08',
  },
});

module.exports = transporter;