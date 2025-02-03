// controllers/rfidController.js

// Importer le modèle Item depuis le dossier models
const Item = require('../models/itemsModel');

// Fonction pour assigner une carte RFID à un utilisateur
exports.assignRFID = async(req, res) => {
    // Récupérer les données userId et carteRfid depuis le corps de la requête
    const { userId, carteRfid } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données par son ID
        const item = await Item.findById(userId);

        // Vérifier si l'utilisateur existe
        if (!item) {
            // Si l'utilisateur n'est pas trouvé, retourner une réponse 404
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si la carte RFID est déjà assignée à cet utilisateur
        if (item.carteRfid) {
            // Si une carte RFID est déjà assignée, retourner une réponse 400
            return res.status(400).json({ message: 'Cette carte RFID est déjà assignée à un utilisateur.' });
        }

        // Assigner l'ID de la carte RFID à l'utilisateur
        item.carteRfid = carteRfid;

        // Sauvegarder les modifications dans la base de données
        await item.save();

        // Retourner une réponse 200 indiquant que l'assignation a réussi
        res.status(200).json({ message: 'Carte RFID assignée avec succès', item });
    } catch (error) {
        // En cas d'erreur, retourner une réponse 500 avec le message d'erreur
        res.status(500).json({ message: error.message });
    }
};