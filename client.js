const express = require('express');
const cors = require('cors');  // Importation du middleware CORS
const WebSocket = require('ws');  // Importation de WebSocket
const app = express();
const port = 3000;

// Utilisation du middleware CORS pour permettre les requêtes depuis d'autres origines
app.use(cors());

// Permet à notre serveur de traiter des données en JSON
app.use(express.json());

// Variable pour stocker les données reçues
let donnees = {};

// Création du serveur WebSocket
const wss = new WebSocket.Server({ noServer: true }); // Le serveur WebSocket va être associé à notre serveur HTTP

// Écoute les connexions WebSocket
wss.on('connection', (ws) => {
  console.log('Un client est connecté via WebSocket');

  // Envoie les dernières données au client immédiatement après la connexion
  if (donnees && donnees.temperature && donnees.humidity) {
    ws.send(JSON.stringify(donnees));
  }

  // Envoie les nouvelles données au client chaque fois que les données sont mises à jour
  ws.on('message', (message) => {
    console.log('Message reçu du client:', message);
  });
});

// Route POST pour recevoir les données du Raspberry Pi
app.post('/donnees', (req, res) => {
  // Récupère les données envoyées par le Raspberry Pi
  const data = req.body;

  // Affiche les données reçues dans la console
  console.log('Données reçues:', data);

  // Vérifie si des données ont été reçues
  if (!data) {
    return res.status(400).json({ message: 'Aucune donnée reçue' });
  }

  // Stocke les données reçues dans la variable 'donnees'
  donnees = data;

  // Envoie les données à tous les clients connectés via WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(donnees));
    }
  });

  // Renvoie une réponse avec les données
  res.status(200).json({
    message: 'Données reçues avec succès',
    data: data,
  });
});

// Route GET pour récupérer les données envoyées
app.get('/donnees', (req, res) => {
  if (!donnees) {
    return res.status(404).json({ message: 'Aucune donnée disponible' });
  }
  res.json(donnees);
});

// Sur le serveur HTTP : le serveur WebSocket doit écouter les connexions
app.server = app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur Node.js en écoute sur http://0.0.0.0:${port}`);
});

// Relie le serveur WebSocket au serveur HTTP existant
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
