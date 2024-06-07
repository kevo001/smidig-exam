const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public/')));

// Route to serve login.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Route to handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`); // Log the email attempting to log in

    const sql = 'SELECT * FROM User WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log('No user found with that email');
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];
        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                console.log('Password match, login successful');
                return res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                console.log('Password does not match');
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

app.post('/register', async (req, res) => {
    const { fname, lname, department, position, dateOfBirth, address, email, tlf, password } = req.body;
    console.log('Received registration data:', req.body);  // Log the request body for debugging

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const sql = `
            INSERT INTO User (firstname, lastname, department, position, birthdate, address, email, phone_number, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [fname, lname, department, position, dateOfBirth, address, email, tlf, hashedPassword];

        db.query(sql, values, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            return res.status(200).json({ success: true, message: 'Registration successful' });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});