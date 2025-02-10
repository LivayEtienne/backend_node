const express = require('express');
const cors = require('cors'); // Importer CORS
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const program = require('./models/Program');
const fs = require('fs');
const { SerialPort } = require('serialport');
const http = require('http');
const { Server } = require('socket.io');


// Connexion à MongoDB
connectDB();

const app = express();
const PORT = 5000;

// Créez le dossier "uploads" s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serveur de fichiers statiques pour les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Activer CORS avec support des credentials
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

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


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/plants', require('./models/Plant'));
app.use('/api/programs', require('./routes/program')); // ✅ Ajout des routes pour la programmation

// Configuration du serveur HTTP et Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

// Configuration du port série pour RFID
const serialPort = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté via Socket.IO');
  
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});




function resetCardReader() {
  console.log('Réinitialisation du lecteur de carte...');
  
  serialPort.write('RESET\n', (err) => {
    if (err) {
      console.error('Erreur lors de la réinitialisation:', err.message);
    } else {
      console.log('Lecteur prêt pour un nouveau scan.');
      io.emit('reader-ready', { status: true });
    }
  });
}

serialPort.on('data', (data) => {
  const cardId = data.toString().trim();

  if (cardId && !cardId.includes("System pret") && !cardId.includes("RFID...")) {
    console.log('Card ID reçu:', cardId);
    io.emit('card-scanned', { cardId });

    // Réinitialisation du lecteur
    setTimeout(resetCardReader, 2000);
  }
});


// Gestion des erreurs du port série
serialPort.on('error', (err) => {
  console.error('Erreur du port série:', err.message);
});

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur de gestion des connexion en fonctionnement');
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});