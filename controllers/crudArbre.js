const Arbre = require('../models/arbreModel');

// Récupérer tous les arbres
exports.getArbres = async (req, res) => {
  try {
    const arbres = await Arbre.find();
    res.status(200).json(arbres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un arbre par ID
exports.getArbreById = async (req, res) => {
  const { id } = req.params;
  try {
    const arbre = await Arbre.findById(id);
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé.' });
    }
    res.status(200).json(arbre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouvel arbre
exports.createArbre = async (req, res) => {
  const { nom, type, volumeEau, humidite, luminosite } = req.body;

  try {
    const newArbre = new Arbre({
      nom,
      type,
      volumeEau,
      humidite,
      luminosite
    });

    const savedArbre = await newArbre.save();
    res.status(201).json(savedArbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un arbre
exports.updateArbre = async (req, res) => {
  const { id } = req.params;
  const { nom, type, volumeEau, humidite, luminosite } = req.body;

  try {
    const updatedArbre = await Arbre.findByIdAndUpdate(
      id,
      { nom, type, volumeEau, humidite, luminosite },
      { new: true }
    );
    if (!updatedArbre) {
      return res.status(404).json({ message: 'Arbre non trouvé.' });
    }
    res.status(200).json(updatedArbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un arbre
exports.deleteArbre = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedArbre = await Arbre.findByIdAndDelete(id);
    if (!deletedArbre) {
      return res.status(404).json({ message: 'Arbre non trouvé.' });
    }
    res.status(200).json({ message: 'Arbre supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archiver un arbre (changer son statut à 'inactif')
exports.archiveArbre = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Trouver l'arbre par ID et mettre à jour son statut à 'inactif'
      const archivedArbre = await Arbre.findByIdAndUpdate(
        id,
        { status: 'inactif' },
        { new: true } // Pour retourner l'arbre mis à jour
      );
  
      if (!archivedArbre) {
        return res.status(404).json({ message: 'Arbre non trouvé.' });
      }
  
      res.status(200).json({
        message: 'Arbre archivé avec succès.',
        arbre: archivedArbre,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Désarchiver un arbre (changer son statut à 'actif')
exports.desarchiverArbre = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Trouver l'arbre par ID et mettre à jour son statut à 'actif'
      const desarchivedArbre = await Arbre.findByIdAndUpdate(
        id,
        { status: 'actif' },
        { new: true } // Pour retourner l'arbre mis à jour
      );
  
      if (!desarchivedArbre) {
        return res.status(404).json({ message: 'Arbre non trouvé.' });
      }
  
      res.status(200).json({
        message: 'Arbre désarchivé avec succès.',
        arbre: desarchivedArbre,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
