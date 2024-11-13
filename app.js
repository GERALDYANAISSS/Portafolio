const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files in the public folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Path to the views directory
const viewsPath = path.join(__dirname, 'views');

// Redirect root path `/` to `/home`
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Serve each HTML file in 'views' as its own route
app.get('/home', (req, res) => {
    res.sendFile(path.join(viewsPath, 'home.html'));
});

// Dynamically serve other HTML files based on filenames
const fs = require('fs');
fs.readdirSync(viewsPath).forEach(file => {
    if (file.endsWith('.html') && file !== 'home.html') {
        const route = '/' + file.replace('.html', '');
        app.get(route, (req, res) => {
            res.sendFile(path.join(viewsPath, file));
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
