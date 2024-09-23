const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes')
const loanRoutes = require('./Routes/loanRoutes')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(()=>app.listen(port, () => console.log(`Server is running on port ${port}`)))
   .catch((err) => console.log(err));
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/loan', loanRoutes)