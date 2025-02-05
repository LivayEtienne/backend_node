// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');



// Routes pour les items
router.post('/delete-multiple', itemController.deleteMultipleItems);

// Route pour créer un nouvel item
router.post('/', itemController.createItem);

// Route pour rechercher par numéro de téléphone
router.get('/search', itemController.searchByPhoneNumber);

// Route pour obtenir tous les items
router.get('/', itemController.getItems);

// Route pour obtenir un item par ID
router.get('/:id', itemController.getItemById);

// Route pour mettre à jour un item
router.put('/:id', itemController.updateItem);

// Route pour supprimer un item
router.delete('/:id', itemController.deleteItem);

// Route pour vérifier l'existence d'un utilisateur
router.post('/check-user', itemController.checkUserExistence);

// **Nouvelle route pour importer des utilisateurs**
router.post('/import', itemController.importCSV); // Ajoutez cette ligne
// Route pour changer le statut d'un item
// router.patch('/status/:id', itemController.toggleItemStatus);


module.exports = router;