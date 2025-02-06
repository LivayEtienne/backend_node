const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour gérer les uploads de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Stockage des fichiers dans le dossier "uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier basé sur la date actuelle
  }
});

const upload = multer({ storage: storage });

// Create a new plant
router.post('/create', upload.single('photo'), plantController.createPlant);

// Get all plants
router.get('/', plantController.getPlants);

// Get a plant by ID
router.get('/:id', plantController.getPlant);

// Update a plant by ID
router.patch('/:id', upload.single('photo'), plantController.updatePlant);

// Delete a plant by ID
router.delete('/:id', plantController.deletePlant);

module.exports = router;
