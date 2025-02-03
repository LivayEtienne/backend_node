const express = require('express');
const router = express.Router();
const programmeArrosageController = require('../controllers/programmeArrosageController');

// Routes pour le programme d'arrosage
router.post('/addProgramme', programmeArrosageController.createProgrammeArrosage); // Ajouter un programme d'arrosage
router.get('/', programmeArrosageController.getProgrammesArrosage); // Récupérer tous les programmes d'arrosage
router.get('/:id/programme', programmeArrosageController.getProgrammeArrosageById); // Récupérer un programme d'arrosage par ID
router.put('/:id/updateprogamme', programmeArrosageController.updateProgrammeArrosage); // Mettre à jour un programme d'arrosage
router.delete('/:id/deleteprogramme', programmeArrosageController.deleteProgrammeArrosage); // Supprimer un programme d'arrosage

// Routes pour archiver et désarchiver
router.put('/:id/archiverprogramme', programmeArrosageController.archiverProgrammeArrosage); // Archiver un programme
router.put('/:id/desarchiverprogramme', programmeArrosageController.desarchiverProgrammeArrosage); // Désarchiver un programme


module.exports = router;
