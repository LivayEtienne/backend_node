const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajoute l'import de CORS
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');

// Connect to MongoDB
connectDB();

const app = express(); // Déclare l'application Express AVANT d'utiliser CORS

// Middleware
app.use(cors()); // Active CORS ici, après la déclaration de `app`
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});