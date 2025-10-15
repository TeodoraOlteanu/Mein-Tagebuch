const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const abcRoutes = require('./routes/ABCModel-route.js'); 
const User = require('./models/User.js');
const userRoutes = require('./routes/userRoutes'); // Add this line

require('dotenv').config();
// Enable CORS for all routes and all origins
app.use(cors());

// Or, enable CORS for all routes but only for specific origins
//app.use(cors({
  //origin: 'http://localhost:3000' // Only allow this origin to access
//}));

// Rest of your route setup

app.use(express.json()); // For parsing application/json


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));



//const User = mongoose.model('User', userSchema);

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});

const validatePassword = (password) => {
  const minLength = 6;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) return false;
  if (!hasNumber.test(password)) return false;
  if (!hasSpecialChar.test(password)) return false;

  return true;
};

// Signup route
app.post('/signup', async (req, res) => {
    console.log(req.body); 
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  //if (password != confirmPassword) {
    //return res.status(400).send('Passwords do not match');
  //}

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
}

if (!validatePassword(password)) {
  return res.status(400).send('Password must be at least 6 characters long and contain at least one digit and one special character');
}


  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).send('Email already in use');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    // Generate a verification token
    const emailToken = jwt.sign(
      { userId: newUser._id.toString() }, // Convert ObjectId to string
      process.env.EMAIL_SECRET,
      { expiresIn: '1d' }  // Expires in 1 day
    );
    

    console.log("JWT created with payload:", { userId: newUser._id.toString() });

    const url = `http://localhost:3001/users/verify/${emailToken}`;

    // Setup email transporter
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

        // Send email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: newUser.email,
          subject: 'Verify Your Account',
          html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
        });



      res.status(201).send('User created successfully. Please check your email address');
    } catch (error) {
      res.status(500).send(error.message);
    }


});

// Login Route
app.post('/login', async (req, res) => {
  console.log(req.body); 
  const { email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send('User not found');
      }

      // check if email is verified
      if (!user.is_verified) return res.status(401).send('Please verify your account first');

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).send('Invalid credentials');
      }


      const token = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, { expiresIn: '1d' });

      if (!token) {
        console.error('Failed to create token');
        return res.status(500).send('Failed to create token');
    }
      console.log('Generated token:', token);
      res.send({ token }); // Ensure this is sending the expected token
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.get('/users/verify/:token', async (req, res) => {
  try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
      console.log("Decoded JWT payload:", decoded); // Ensures the payload is logged after decoding

      // Assuming you're using MongoDB with Mongoose
      const updatedUser = await User.findByIdAndUpdate(
          decoded.userId,
          { $set: { is_verified: true } },
          { new: true } // This option returns the updated document
      );

      if (!updatedUser) {
          return res.status(404).send('User not found.');
      }

      res.send('Account verified successfully.');
  } catch (error) {
      console.error("Verification error:", error);
      res.status(500).send('Verification failed. The link may be invalid or expired.');
  }
});


app.use(bodyParser.json());
app.use(abcRoutes); // No prefix, routes are accessed directly as defined in abcRoutes
app.use(userRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
