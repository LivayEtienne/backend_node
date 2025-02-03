const express = require('express');
const itemController = require('../controllers/itemController');
const {
  getItems,
  createItem,
  updateItem,
  deleteUser,
  archiveItem,
  unarchiveItem,
  modifyUser,  // Ajout de la méthode de modification
} = require('../controllers/itemController');

const router = express.Router();

// Routes CRUD
router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);  // Mise à jour complète d'un item

// Routes pour l'archivage et désarchivage
router.put('/:id/archive', archiveItem);
router.put('/:id/unarchive', unarchiveItem);

// Route pour modifier un utilisateur
router.put('/:id/modify', modifyUser);

// Suppression d'un utilisateur
router.delete('/:id/delete', deleteUser);


module.exports = router;
