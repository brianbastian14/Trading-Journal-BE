const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

module.exports = async (to, otp) => {
  await transporter.sendMail({
    from: '"Trading Journal" <' + process.env.EMAIL_USER + '>',
    to,
    subject: 'OTP Register',
    text: `Kode OTP kamu: ${otp}`
  })
}