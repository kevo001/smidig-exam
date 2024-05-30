const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve login.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Route to handle form submission
app.post('/submit1', (req, res) => {
    const {
        land,
        orgNavn,
        orgNummer,
        borsnotert,
        aksjeklasse,
        antall,
        driftstatus,
        fra,
        til,
        kommentar,
        habilitet
    } = req.body;

    const sql = `
        INSERT INTO Ownership_Interests (
            country, organization_name, organization_number, is_listed, share_class,
            number_of_shares, status, ownership_start, ownership_end, comment, relevant_to_habilitation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        land,
        orgNavn,
        orgNummer,
        borsnotert === 'ja', // Convert 'ja'/'nei' to boolean
        aksjeklasse,
        antall,
        driftstatus,
        fra || null, // If no date is provided, set it to null
        til || null, // If no date is provided, set it to null
        kommentar,
        habilitet === 'ja' // Convert 'ja'/'nei' to boolean
    ];

    db.query(sql, values, (err, results) => {
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