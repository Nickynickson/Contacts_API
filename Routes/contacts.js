const express = require('express');
const { getCollection } = require('../Config/DB');
const { ObjectId } = require('mongodb');

const router = express.Router();

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const collection = getCollection('contacts');
        const contacts = await collection.find().toArray();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single contact
router.get('/:id', async (req, res) => {
    try {
        const collection = getCollection('contacts');
        const id = req.params.id;

        // Log the ID being requested
        console.log(`Requesting contact with ID: ${id}`);

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            console.warn(`Invalid ID format: ${id}`);
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const contactId = new ObjectId(id);
        const contact = await collection.findOne({ _id: contactId });

        // Log the result of the database query
        if (!contact) {
            console.warn(`Contact not found for ID: ${id}`);
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        console.log(`Contact found: ${JSON.stringify(contact)}`);
        res.json(contact);
    } catch (error) {
        console.error(`Error retrieving contact: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

/// POST a new contact
router.post('/', async (req, res) => {
    try {
        const collection = getCollection('contacts');
        const contactData = req.body;

        // Validate incoming data
        if (!contactData || typeof contactData !== 'object' || Object.keys(contactData).length === 0) {
            return res.status(400).json({ message: 'Invalid data: Request body cannot be empty' });
        }

        // Check for required fields
        const requiredFields = ['firstName', 'email', 'phone'];
        for (const field of requiredFields) {
            if (!contactData[field]) {
                return res.status(400).json({ message: `Invalid data: Missing required field '${field}'` });
            }
        }

        const result = await collection.insertOne(contactData);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        console.error(`Error inserting contact: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// PUT (update) a contact
router.put('/:id', async (req, res) => {
    try {
        const collection = getCollection('contacts');
        const id = req.params.id;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedData = req.body;

        // Validate incoming data
        if (!updatedData || typeof updatedData !== 'object' || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'Invalid data: Request body cannot be empty' });
        }

        
        const allowedFields = ['firstName', 'email', 'phone']; 
        const hasInvalidFields = Object.keys(updatedData).some(field => !allowedFields.includes(field));

        if (hasInvalidFields) {
            return res.status(400).json({ message: 'Invalid data: One or more fields are not allowed' });
        }

        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Contact not found or no changes made' });
        }

        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        console.error(`Error updating contact: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});



// DELETE a contact
router.delete('/:id', async (req, res) => {
    try {
        const collection = getCollection('contacts');
        const id = req.params.id;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
