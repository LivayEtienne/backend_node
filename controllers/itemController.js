const Item = require('../models/itemsModel');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');


// Créer un nouvel item
exports.createItem = async(req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Vérification de l'existence d'un utilisateur par téléphone ou carte RFID
exports.checkUserExistence = async(req, res) => {
    const { telephone, carteRfid } = req.body;

    try {
        const existingUserByPhone = await Item.findOne({ telephone });
        const existingUserByRfid = await Item.findOne({ carteRfid });

        if (existingUserByPhone) {
            return res.json({ exists: true, type: 'telephone' });
        }

        if (existingUserByRfid) {
            return res.json({ exists: true, type: 'carteRfid' });
        }

        // Si aucun utilisateur n'existe
        res.json({ exists: false });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les items
exports.getItems = async(req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un item par ID
exports.getItemById = async(req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item non trouvé' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un item
exports.updateItem = async(req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Item non trouvé' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un item
exports.deleteItem = async(req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item non trouvé' });
        res.status(200).json({ message: 'Item supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fonction asynchrone pour supprimer plusieurs items
exports.deleteMultipleItems = async(req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Aucun ID fourni' });
        }

        const result = await Item.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} item(s) supprimé(s)` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rechercher un utilisateur par numéro de téléphone
exports.searchByPhoneNumber = async(req, res) => {
    try {
        const { phoneNumber } = req.query;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Numéro de téléphone requis' });
        }

        const items = await Item.find({ telephone: phoneNumber });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Configuration de Multer pour gérer l'upload de fichiers
const upload = multer({ dest: 'uploads/' });

// Fonction d'importation CSV
exports.importCSV = async(req, res) => {
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
};

// Exporter la configuration de multer pour l'utiliser dans les routes
exports.upload = upload;