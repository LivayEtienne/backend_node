const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Créez le dossier "uploads" s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200', // CORS pour autoriser Angular
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Serveur de fichiers statiques pour les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_arrosage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB', err);
});

// Configuration de multer pour gérer les uploads de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Stockage des fichiers dans le dossier "uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier basé sur la date actuelle
  }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/plants', require('./routes/plants'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/programs', require('./routes/program')); // ✅ Ajout des routes pour la programmation


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
