const { createUser, updateUser, deleteUser } = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { pool } = require('../connect');
const { createTokenForUser } = require("../services/auth");

// Sending email using nodemailer
async function sendMail(email, subject, message) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
  });

  try {
    const info = await transporter.sendMail({
      from: '"Blogify" <dwivediji425@gmail.com>',
      to: email, // Dynamic receiver email
      subject: subject,
      text: message, // OTP message
      html: "", // Optional HTML content
    });

    console.log("Message sent: %s", info.messageId);
    return true; // Indicating success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return false on failure
  }
}

const sendOtp = async (req, res) => {
  const email = req.body.email;
  const otp = Math.floor(Math.random() * 900000) + 100000;
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  req.session.otp = hashedOtp;
  req.session.otpExpiry = Date.now() + 300000; // 5 minutes

  // Check if the email already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(401).json({ msg: "Email already exists" });
  }

  // Send the OTP email
  const emailResponse = await sendMail(
    email,
    "OTP Verification",
    `Your OTP is: ${otp}`
  );

  // Check if email was sent successfully
  if (!emailResponse) {
    // Just checking if the result is true or false
    return res
      .status(500)
      .json({ message: "Error sending email. Please try again." });
  } else {
    return res.status(200).json({ message: "OTP sent successfully" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    // Check if OTP and its expiry exist in the session
    const hashedOtp = req.session.otp;
    const otpExpiry = req.session.otpExpiry;

    if (!hashedOtp || !otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP session has expired or is invalid" });
    }

    // Check if OTP has expired
    if (Date.now() > otpExpiry) {
      req.session.otp = null; // Clear OTP
      req.session.otpExpiry = null;
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify the OTP
    const isOtpValid = await bcrypt.compare(otp, hashedOtp);
    if (isOtpValid) {
      // Clear OTP and expiry after successful verification
      req.session.otp = null;
      req.session.otpExpiry = null;

      const message = "OTP verified successfully";
      return res.redirect('/signup');
    } else {
      return res
        .status(401)
        .json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
};

const handleUserSignUp = async (req, res) => {
  const body = req.body;
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const user = {
      full_name: body.name,
      password: hashedPassword,
      email: body.email,
      profilePic: req.file ? req.file.filename : "user.png",
    };
    const result = createUser(user);
    res.render("login", {
      msg: "Your account has been created successfully. Now you can login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("register", {
      error: "An unexpected error occurred. Please try again.",
    });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    // Find the user by email
    const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).render('login', {
        error: 'Invalid email',
      });
    }

    console.log(rows[0]);
    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).render('login', {
        error: 'Invalid email or password',
      });
    }

    // Create and set a token
    const token = createTokenForUser(rows[0]);
    console.log(token);

    // Redirect after setting the cookie
    res.cookie('token', token).redirect('/');
    return; // Ensure no further response is attempted
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', {
      error: 'An unexpected error occurred. Please try again.',
    });
    return;
  }
};

const handleUserUpdatation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const img = req.file ? req.file.filename : "user.png";
    const dataToBeUpdated = {
      full_name: name,
      email: email,
      profilePic: img
    };
    const result = await updateUser(userId, dataToBeUpdated);
    console.log(result);
    res.redirect(`/user/${userId}`);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).render("error", {
      error: "An unexpected error occurred. Please try again.",
    });
  }
};

const displayUserSpace = async (req, res) => {
  // Implement user space logic
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    const result = await deleteUser(userId);
    console.log(result);
    if (result > 0) {
      res.status(200).json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'An error occurred while deleting the user.', error: error.message });
  }
};


module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserUpdatation,
  displayUserSpace,
  sendOtp,
  verifyOtp,
  deleteUserAccount
};
