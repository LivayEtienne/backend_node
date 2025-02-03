const express = require('express');
const router = express.Router();
const crudArbre = require('../controllers/crudArbre');

// Routes pour gérer les arbres
router.get('/', crudArbre.getArbres); // Récupérer tous les arbres
router.get('/:id', crudArbre.getArbreById); // Récupérer un arbre par ID
router.post('/addArbre', crudArbre.createArbre); // Créer un arbre
router.put('/:id/update', crudArbre.updateArbre); // Mettre à jour un arbre
router.delete('/:id/deleteArbre', crudArbre.deleteArbre); // Supprimer un arbre

router.put('/:id/archiveArbre', crudArbre.archiveArbre); // Archiver un arbre

router.put('/:id/desarchiverArbre', crudArbre.desarchiverArbre); // Désarchiver un arbre


module.exports = router;
