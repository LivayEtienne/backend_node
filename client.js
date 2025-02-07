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
    const pythonScriptPath = '/home/etienne/Desktop/dht_test11/test.py'; 

    // Exécution du script Python via SSH
    conn.exec(`python3 ${pythonScriptPath}`, (err, stream) => {
        if (err) {
            console.error('Erreur lors de l\'exécution du script Python:', err);
            return;
        }

        let pythonOutput = '';
        
        stream.on('data', (data) => {
            pythonOutput += data.toString();
        }).on('close', (code, signal) => {
            console.log(`Le script Python s'est terminé avec le code : ${code}`);

            // Si le script s'est bien exécuté, renvoyer la sortie comme réponse de l'API
            const output = parsePythonData(pythonOutput);
            
            // Rediriger vers l'API
            app.get('/api/data', (req, res) => {
                res.json(output);
            });

            conn.end(); // Fermer la connexion SSH après l'exécution
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

// Fonction pour parser la sortie du script Python
// Fonction pour parser la sortie du script Python
function parsePythonData(pythonData) {
    // Exemple d'extraction des données, à ajuster en fonction de la sortie exacte de ton script
    const regex = /Temp=([\d.]+)°C, Temp=([\d.]+)°F, Humidity=([\d.]+)%/;
    const match = pythonData.match(regex);

    if (match) {
        return {
            temperature_c: parseFloat(match[1]),
            temperature_f: parseFloat(match[2]),
            humidity: parseFloat(match[3])
        };
    } else {
        return { error: 'Données non disponibles' };
    }
}


// Démarrer le serveur HTTP sur le port 3000
app.listen(port, () => {
    console.log(`Serveur Node.js écoute sur http://localhost:${port}`);
});
