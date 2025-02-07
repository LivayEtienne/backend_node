const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http'); // Ajout du module HTTP
const { Server } = require('socket.io'); // Ajout de socket.io

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Création d'un serveur HTTP
const io = new Server(server, {
    cors: { origin: "*" } // Permet les requêtes cross-origin depuis Angular
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);

// Configure le port série
const port = new SerialPort({
    path: '/dev/ttyACM0', // Remplace par ton port correct
    baudRate: 9600,
}, (err) => {
    if (err) {
        return console.error('Erreur de connexion au port série: ', err.message);
    }
    console.log('Port série ouvert');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Écoute des connexions WebSocket
io.on('connection', (socket) => {
    console.log('Un client Angular est connecté via WebSocket');

    socket.on('disconnect', () => {
        console.log('Un client s\'est déconnecté');
    });
});

// Écoute les données RFID et les envoie au frontend
parser.on('data', (line) => {
    console.log(`Donnée brute reçue : ${line}`);

    // Vérifie si la ligne contient "UID :" et extrait uniquement les chiffres
    const match = line.match(/UID\s*:\s*([\d\s]+)/);
    if (match) {
        let uid = match[1].trim().split(' ').join(''); // Supprime les espaces
        console.log(`UID formaté : ${uid}`);

        // Envoie l'UID via WebSocket (si tu utilises Socket.io)
        io.emit('rfid-scanned', uid);
    }
});


// Gérer les erreurs de port série
port.on('error', err => {
    console.error('Erreur de port : ', err.message);
});

// Démarrer le serveur HTTP + WebSocket
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});