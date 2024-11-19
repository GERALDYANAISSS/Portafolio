const PDFDocument = require('pdfkit');
const express = require('express');
const path = require('path');
const supabase = require('./supabase');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas api

app.get('/planes/:planId/pdf', async (req, res) => {
    const { planId } = req.params;

    try {
        // Obtener los datos del plan desde la base de datos
        const { data: plan, error } = await supabase
            .from('planes_personalizados')
            .select(`
                plan_id,
                diagnostico,
                descripcion,
                objetivos,
                observaciones,
                fecha_creacion,
                paciente (nombre),
                usuarios!planes_personalizados_tutor_id_fkey (nombre)
            `)
            .eq('plan_id', planId)
            .single();

        if (error || !plan) {
            return res.status(404).json({ error: "Plan no encontrado" });
        }

        // Crear el PDF con pdfkit
        const doc = new PDFDocument();
        const pdfPath = `Plan_${planId}.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Generar contenido del PDF
        doc.pipe(res);
        doc.fontSize(16).text(`Plan Personalizado (ID: ${plan.plan_id})`, { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Paciente: ${plan.paciente.nombre || "Sin Nombre"}`);
        doc.text(`Tutor: ${plan.usuarios.nombre || "Sin Nombre"}`);
        doc.text(`Diagnóstico: ${plan.diagnostico || "Sin Diagnóstico"}`);
        doc.text(`Objetivos: ${plan.objetivos || "Sin Objetivos"}`);
        doc.text(`Descripción: ${plan.descripcion || "Sin Descripción"}`);
        doc.text(`Observaciones: ${plan.observaciones || "Sin Observaciones"}`);
        doc.text(`Fecha de Creación: ${plan.fecha_creacion}`);

        doc.end();
    } catch (error) {
        console.error("Error al generar el PDF:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.post('/cargas', async (req, res) => {
    const { tutorId } = req.body; // Acceder al tutorId del cuerpo de la solicitud

    if (!tutorId) {
        return res.status(400).json({ error: "Falta el ID del tutor" });
    }

    try {
        const { data, error } = await supabase
            .from('paciente')
            .select('nombre, edad, nivel_ed, rut, fech_nac')
            .eq('id_tutor', tutorId);

        if (error) {
            console.error("Error en la consulta a Supabase:", error.message);
            return res.status(500).json({ error: "Error al obtener los pacientes" });
        }

        res.status(200).json(data || []); // Responder con los datos o un arreglo vacío
    } catch (error) {
        console.error("Error interno en el servidor:", error.message);
        res.status(500).json({ error: "Error interno en el servidor" });
    }
});

app.post('/infante', async (req, res) => {
    const { nombre, edad, nivel_ed, rut, fech_nac, id_tutor } = req.body;

    // Validar los campos obligatorios
    if (!nombre || !edad || !rut || !fech_nac || !id_tutor) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    try {
        // Insertar el nuevo paciente en Supabase
        const { data, error } = await supabase
            .from('paciente')
            .insert([
                {
                    nombre,
                    edad,
                    nivel_ed,
                    rut,
                    fech_nac,
                    id_tutor
                }
            ]);

        if (error) {
            console.error("Error al insertar paciente en Supabase:", error.message);
            return res.status(500).json({ success: false, message: "Error al guardar el paciente." });
        }

        res.status(201).json({ success: true, message: "Paciente agregado exitosamente.", data });
    } catch (error) {
        console.error("Error interno en el servidor:", error.message);
        res.status(500).json({ success: false, message: "Error interno en el servidor." });
    }
});

// Obtener todos los tutores
app.get('/tutores', async (req, res) => {
    const { data, error } = await supabase.from('usuarios').select('usuario_id, nombre').eq('tipo_usuario', 'padre');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Obtener datos del tutor por ID
app.get('/tutor/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('usuarios').select('rut, telefono').eq('usuario_id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Obtener pacientes asociados a un tutor
app.get('/pacientes/:tutorId', async (req, res) => {
    const { tutorId } = req.params;
    const { data, error } = await supabase.from('paciente').select('id, nombre').eq('id_tutor', tutorId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Obtener datos de un paciente por ID
app.get('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('paciente').select('edad').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Guardar planificación
app.post('/planificaciones', async (req, res) => {
    const { tutorId, pacienteId, diagnostico, objetivos, descripcionPlan, observaciones, fonoaudiologa_id} = req.body;

    const { data, error } = await supabase.from('planes_personalizados').insert({
        tutor_id: tutorId,
        id_paciente: pacienteId,
        fonoaudiologa_id,
        diagnostico,
        objetivos,
        descripcion: descripcionPlan,
        observaciones,
    });

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Plan guardado exitosamente.", data });
});

app.get('/planes', async (req, res) => {
    const { fonoaudiologaId } = req.query;

    if (!fonoaudiologaId) {
        return res.status(400).json({ error: "Falta el ID de la fonoaudióloga." });
    }

    try {
        // Consulta usando relaciones definidas en Supabase
        const { data, error } = await supabase
            .from('planes_personalizados')
            .select(`
                plan_id,
                diagnostico,
                descripcion,
                objetivos,
                observaciones,
                fecha_creacion,
                paciente (id, nombre),
                usuarios!planes_personalizados_tutor_id_fkey (nombre, usuario_id)
            `)
            .eq('fonoaudiologa_id', fonoaudiologaId);

        if (error) {
            console.error("Error en Supabase:", error.message);
            return res.status(500).json({ error: "Error al obtener los planes." });
        }

        res.status(200).json(data || []);
    } catch (err) {
        console.error("Error interno del servidor:", err.message);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

app.delete('/planes/:planId', async (req, res) => {
    const { planId } = req.params;

    try {
        const { data, error } = await supabase
            .from('planes_personalizados')
            .delete()
            .eq('plan_id', planId);

        if (error) {
            console.error("Error al eliminar el plan:", error.message);
            return res.status(500).json({ success: false, message: "Error al eliminar el plan." });
        }

        res.status(200).json({ success: true, message: "Plan eliminado exitosamente.", data });
    } catch (err) {
        console.error("Error interno del servidor:", err.message);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
});





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