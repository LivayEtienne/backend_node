// controllers/itemController.js
const Item = require('../models/itemsModel');

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
    console.log('Requête reçue pour supprimer des items :', req.body);
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


// Changer le statut d'un item
exports.toggleItemStatus = async(req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item non trouvé' });

        item.status = !item.status; // Inverser le statut
        await item.save(); // Sauvegarder les modifications
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rechercher un utilisateur par numéro de téléphone
exports.searchByPhoneNumber = async(req, res) => {
    try {
        console.log('Requête reçue :', req.query);
        const { phoneNumber } = req.query;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Numéro de téléphone requis' });
        }

        const items = await Item.find({ telephone: phoneNumber });
        res.status(200).json(items);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.importCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier CSV fourni' });
        }

        const items = [];

        fs.createReadStream(req.file.path)
            .pipe(csv()) // Assurez-vous que csv-parser est bien installé et utilisé ici
            .on('data', (data) => items.push(data))
            .on('end', async () => {
                try {
                    await Item.insertMany(items);
                    res.status(201).json({ message: `${items.length} items importés avec succès` });
                } catch (error) {
                    res.status(500).json({
                        message: 'Erreur lors de l\'importation des données',
                        error: error.message
                    });
                }
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Changer le statut d'un item
exports.toggleItemStatus = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item non trouvé' });

        item.status = !item.status; // Inverser le statut

        await item.save(); // Sauvegarder les modifications
        res.status(200).json(item); // Retourner l'item avec le nouveau statut
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
