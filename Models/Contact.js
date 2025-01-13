// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    favoriteColor: { type: String },
    birthday: { type: Date },
});

module.exports = mongoose.model('Contact', ContactSchema);
