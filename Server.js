require('dotenv').config();

const express = require('express');
const { connectDB } = require('./Config/DB'); // Correctly destructured import
const contactsRouter = require('./Routes/contacts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/contacts', contactsRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
