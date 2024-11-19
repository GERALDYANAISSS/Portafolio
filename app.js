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
        // Realizar login con Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(400).json({ success: false, message: 'Login failed', error: authError.message });
        }

        // Obtener el id del usuario desde la autenticación
        const userId = authData?.user?.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not found' });
        }

        // Consultar la tabla usuarios para obtener información adicional
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario_id', userId)
            .single();

        if (userError) {
            return res.status(400).json({ success: false, message: 'Error fetching user details', error: userError.message });
        }

        // Responder con los datos del usuario
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: userId,
                    tipo_usuario: userData.tipo_usuario,
                    nombre: userData.nombre,
                    email: userData.email,
                    telefono: userData.telefono,
                    direccion: userData.direccion,
                    rut: userData.rut,
                    universidad: userData.universidad,
                    carrera: userData.carrera,
                    especialidad: userData.especialidad,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.post('/registro', async (req, res) => {
    const {
        correo,
        password,
        nombre,
        apellido,
        rut,
        fechaNacimiento,
        telefono,
        direccion,
        tipoUsuario,
        universidad,
        carrera,
        especialidad,
    } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: correo,
            password: password
        });

        if (error) {
            return res.status(400).json({ success: false, message: 'Registro fallido', error: error.message });
        }

        const userId = data.user.id;

        // Datos adicionales
        const userData = {
            usuario_id: userId,
            email: correo,
            nombre: `${nombre} ${apellido}`,
            rut: rut,
            fecha_nacimiento: fechaNacimiento,
            telefono: telefono,
            direccion: direccion,
            tipo_usuario: tipoUsuario,
        };

        // Agregar datos específicos para fonoaudiólogas
        if (tipoUsuario === 'fonoaudiologa') {
            userData.universidad = universidad;
            userData.carrera = carrera;
            userData.especialidad = especialidad;
        }

        const { error: dbError } = await supabase.from('usuarios').insert([userData]);

        if (dbError) {
            return res.status(400).json({ success: false, message: 'Error al guardar datos adicionales', error: dbError.message });
        }

        return res.status(200).json({ success: true, message: 'Registro exitoso', data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
});


app.post('/logout', async (req, res) => {
    try {
        // Cerrar sesión con Supabase
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error al cerrar sesión:", error.message);
            return res.status(400).json({ success: false, message: "Error al cerrar sesión", error: error.message });
        }

        // Respuesta exitosa
        return res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
    } catch (err) {
        console.error("Error inesperado:", err);
        return res.status(500).json({ success: false, message: "Error inesperado en el servidor", error: err.message });
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