const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const app = express();
const port = 3000;
const cors = require("cors")

// Middleware to parse JSON
app.use(express.json());

// Middleware to enable CORS
app.use(cors());
// MongoDB connection
const dbURI = 'mongodb+srv://dew669035:6BY9ADx21wEIrcZ1@diglart.dhzttxg.mongodb.net/?retryWrites=true&w=majority&appName=diglart';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Failed to connect to MongoDB', error));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Search users by name
app.get('/users/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const users = await User.find({ name: new RegExp(name, 'i') });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a new user
app.post('/newUser', async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a user by ID
app.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
