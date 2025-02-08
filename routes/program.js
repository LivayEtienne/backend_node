const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

router.post('/create', programController.addProgram); // Ajouter une programmation
router.get('/', programController.getPrograms); // Récupérer toutes les programmations
router.put('/:id', programController.updateProgram); // Modifier une programmation
router.delete('/:id', programController.deleteProgram); // Supprimer une programmation
router.get('/:id', programController.getProgramById); // Récupérer une programmation par son ID
router.get('/plant/:plantId', programController.getProgramsByPlantId); // Récupérer les programmes pour une plante spécifique

module.exports = router;