const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
let db = new sqlite3.Database(path.resolve(__dirname, './passwords.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Create passwords table if it does not exist
db.run(`CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT,
    strength TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Passwords table is ready.');
    }
});

// Save password and strength endpoint
app.post('/save-password', (req, res) => {
    const { password, strength } = req.body;

    if (!password || !strength) {
        return res.status(400).json({ message: 'Invalid input: password or strength is missing' });
    }

    db.run(`INSERT INTO passwords(password, strength) VALUES(?, ?)`, [password, strength], function(err) {
        if (err) {
            console.error('Error inserting password:', err.message);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json({ message: 'Password and strength saved', id: this.lastID });
    });
});

// Serve the options page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the password generator page
app.get('/generate-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'generate-password.html'));
});

// Serve the password strength checking page
app.get('/check-strength', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strength-check.html'));
});

// Start the server and display the URL
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
