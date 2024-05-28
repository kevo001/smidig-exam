const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path'); // Import the path module

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    db.query('INSERT INTO your_table_name (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        return res.status(200).json({ success: true, message: 'Data inserted successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});