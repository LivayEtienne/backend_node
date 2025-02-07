const ssh2 = require('ssh2');
const express = require('express');
const cors = require('cors');  // Importer le middleware CORS
const app = express();
const port = 3000;

// Utiliser le middleware CORS pour autoriser les requêtes provenant de localhost:4200
app.use(cors({
    origin: 'http://localhost:4200',  // Permet les requêtes depuis Angular
    methods: 'GET,POST',             // Autorise certaines méthodes HTTP
    allowedHeaders: 'Content-Type,Authorization'  // Autorise certains headers
}));

// Crée une nouvelle connexion SSH
const conn = new ssh2.Client();

conn.on('ready', () => {
    console.log('Connexion SSH établie');

    // Chemin vers le script Python
    const pythonScriptPath = '/home/etienne/Desktop/humiditesol.py'; 

    // Exécution du script Python via SSH
    conn.exec(`python3 ${pythonScriptPath}`, (err, stream) => {
        if (err) {
            console.error('Erreur lors de l\'exécution du script Python:', err);
            return;
        }

        stream.on('close', (code, signal) => {
            console.log(`Le script Python s'est terminé avec le code : ${code}`);
            conn.end(); // Fermer la connexion SSH après l'exécution
        }).on('data', (data) => {
            console.log('Sortie du script Python:', data.toString());
        }).on('stderr', (data) => {
            console.error('Erreur du script Python:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Erreur SSH:', err);
}).connect({
    host: '192.168.1.94',  // IP du Raspberry Pi
    port: 22,              // Port SSH
    username: 'etienne',   // Nom d'utilisateur
    password: 'simplon'    // Mot de passe
});

// Création du serveur HTTP
app.get('/api/data', (req, res) => {
    // Exemple de données dynamiques, tu peux remplacer ceci par les données de ton script Python
    const data = {
        humidity: Math.floor(Math.random() * 100),
        lightLevel: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 30)
    };

    res.json({ data });
});

// Démarrer le serveur HTTP sur le port 3000
app.listen(port, () => {
    console.log(`Serveur Node.js écoute sur http://localhost:${port}`);
});
