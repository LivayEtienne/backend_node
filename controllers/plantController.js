const Plant = require('../models/Plant');

// Create a new plant
exports.createPlant = async (req, res) => {
  try {
    const plantData = {
      nom: req.body.nom,
      category: req.body.category,
      photo: req.file ? req.file.path : '',  // Le chemin du fichier téléchargé, sinon une chaîne vide
      seuilHumidity: req.body.seuilHumidity,
      seuilLuminosity: req.body.seuilLuminosity,
      volumeEau: req.body.volumeEau,
      eauUnit: req.body.eauUnit,
    };

    // Créez la nouvelle plante dans la base de données
    const plant = new Plant(plantData);
    await plant.save();
    res.status(201).json({ message: 'Plante créée avec succès', plant });
  } catch (err) {
    console.error('Error creating plant:', err);
    res.status(400).json({ message: 'Erreur lors de la création de la plante', error: err.message });
  }
};

// Get all plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plantes', error: err.message });
  }
};

// Get a plant by ID
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la plante', error: err.message });
  }
};

// Update a plant by ID
exports.updatePlant = async (req, res) => {
  try {
    const plantData = {
      nom: req.body.nom,
      category: req.body.category,
      photo: req.file ? req.file.path : '',  // Le chemin du fichier téléchargé, sinon une chaîne vide
      seuilHumidity: req.body.seuilHumidity,
      seuilLuminosity: req.body.seuilLuminosity,
      volumeEau: req.body.volumeEau,
      eauUnit: req.body.eauUnit,
    };

    const plant = await Plant.findByIdAndUpdate(req.params.id, plantData, { new: true, runValidators: false });
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    res.status(200).json({ message: 'Plante mise à jour avec succès', plant });
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la plante', error: err.message });
  }
};

// Delete a plant by ID
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    res.status(200).json({ message: 'Plante supprimée avec succès', plant });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la plante', error: err.message });
  }
};
