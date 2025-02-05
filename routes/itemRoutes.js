const express = require('express');
const itemController = require('../controllers/itemController');


const { loginItem } = require('../controllers/AuthController');
const router = express.Router();

// Connexion des utilisateurs (pas besoin de middleware)
router.post('/login', loginItem)

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

// Route pour changer le statut d'un item
// router.patch('/status/:id', itemController.toggleItemStatus);



  
/**
 * Route pour la déconnexion de l'utilisateur
 */
router.post('/logout', (req, res) => {
  try {
    // Effacer le cookie authToken
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict',
    });
    return res.status(200).json({ msg: 'Déconnexion réussie' });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});



module.exports = router;
