const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const Item = require('../models/itemsModel');
const router = express.Router();

// Configuration de Multer pour gérer l'upload de fichiers
const upload = multer({ dest: 'uploads/' });

// Route pour importer des utilisateurs à partir d'un CSV
router.post('/import-csv', upload.single('csv_file'), async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Fichier CSV requis' });
    }

    const errors = [];
    const importedUsers = [];
    let lineNumber = 1;

    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', async(record) => {
            lineNumber++;

            // Validation des données
            if (!record.nom || !record.prenom || !record.telephone || !record.carteRfid) {
                errors.push({ line: lineNumber, message: 'Données manquantes', data: record });
                return;
            }

            try {
                // Vérifier si le téléphone ou la carte RFID existe déjà
                const existingUser = await Item.findOne({
                    $or: [{ telephone: record.telephone }, { carteRfid: record.carteRfid }]
                });

                if (existingUser) {
                    errors.push({ line: lineNumber, message: 'Téléphone ou carte RFID déjà utilisé', data: record });
                    return;
                }

                // Créer un nouvel utilisateur
                const newUser = new Item({
                    nom: record.nom,
                    prenom: record.prenom,
                    carteRfid: record.carteRfid,
                    telephone: record.telephone,
                    adresse: record.adresse || '',
                    role: 'Utilisateur',
                    status: true
                });
                await newUser.save();
                importedUsers.push(newUser);
            } catch (err) {
                errors.push({ line: lineNumber, message: err.message, data: record });
            }
        })
        .on('end', () => {
            fs.unlinkSync(req.file.path); // Supprimer le fichier après traitement
            res.json({ imported_users: importedUsers, errors });
        })
        .on('error', (err) => {
            res.status(500).json({ message: 'Erreur lors de la lecture du fichier', error: err.message });
        });
});

module.exports = router;