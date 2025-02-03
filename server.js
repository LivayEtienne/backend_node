const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- Importez CORS
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const curdArbre = require('./routes/arbreRoutes');
const programmeArrosageRoutes = require('./routes/programmeArrosageRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // <-- Activez CORS pour toutes les routes

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/items', curdArbre);

// Routes pour gérer les programmes d'arrosage
app.use('/api/programmes', programmeArrosageRoutes);
// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});