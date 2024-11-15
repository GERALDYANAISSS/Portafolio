// Importa la biblioteca de Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Carga las variables de entorno del archivo .env

// Configura la conexión usando las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;