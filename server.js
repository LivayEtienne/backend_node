// const express = require('express');
// const cors = require('cors'); // Importer CORS
// const bodyParser = require('body-parser');
// const connectDB = require('./config/database');
// const itemRoutes = require('./routes/itemRoutes');

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Activer CORS avec support des credentials
// app.use(cors({
//   origin: 'http://localhost:4200', // Remplace par ton URL frontend
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true //Permet l'envoi des cookies/tokens
// }));

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/api/items', itemRoutes);

// // Démarrer le serveur
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });





const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const { SerialPort } = require('serialport');
const http = require('http');
const { Server } = require('socket.io');
const itemRoutes = require('./routes/itemRoutes');

// Connexion à MongoDB
connectDB();

const app = express();
const PORT = 5000;

// Activer CORS avec support des credentials
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);

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

// Gestion des données reçues du lecteur RFID
serialPort.on('data', (data) => {
  const cardId = data.toString().trim();
  console.log('Card ID reçu:', cardId);
  
  // Émettre l'ID de la carte aux clients connectés
  io.emit('card-scanned', { cardId });
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
