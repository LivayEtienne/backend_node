const express = require('express');
const cors = require('cors'); // Importer CORS
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Activer CORS avec support des credentials
app.use(cors({
  origin: 'http://localhost:4200', // Remplace par ton URL frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true //Permet l'envoi des cookies/tokens
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
