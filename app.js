const express = require('express');
const path = require('path');
const supabase = require('./supabase');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files in the public folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/iniciarsesion', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ success: false, message: 'Login failed', error: error.message });
        }

        return res.status(200).json({ success: true, message: 'Login successful', data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});


app.post('/registro', async (req, res) => {
    const { correo, password, nombre, apellido, rut, fechaNacimiento, telefono, direccion, tipoUsuario } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: correo,
            password: password
        });

        if (error) {
            return res.status(400).json({ success: false, message: 'Registro fallido', error: error.message });
        }

        const userId = data.user.id;

        // Guardar datos adicionales en la tabla "usuarios" incluyendo el UUID y tipo de usuario
        const { error: dbError } = await supabase.from('usuarios').insert([{
            usuario_id: userId,
            email: correo,
            nombre: nombre+" "+apellido,
            rut: rut,
            fecha_nacimiento: fechaNacimiento,
            telefono: telefono,
            direccion: direccion,
            tipo_usuario: tipoUsuario
        }]);

        if (dbError) {
            return res.status(400).json({ success: false, message: 'Error al guardar datos adicionales', error: dbError.message });
        }

        return res.status(200).json({ success: true, message: 'Registro exitoso', data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
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

module.exports = app;