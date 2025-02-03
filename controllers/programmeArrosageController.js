const ProgrammeArrosage = require('../models/programmeArrosageModel');

// Créer un programme d'arrosage
exports.createProgrammeArrosage = async (req, res) => {
  const { heureArrosage, dateArrosage, quantiteEau } = req.body;

  try {
    const newProgramme = new ProgrammeArrosage({
      heureArrosage,
      dateArrosage,
      quantiteEau
    });

    const savedProgramme = await newProgramme.save();
    res.status(201).json(savedProgramme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les programmes d'arrosage
exports.getProgrammesArrosage = async (req, res) => {
  try {
    const programmes = await ProgrammeArrosage.find();
    res.status(200).json(programmes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un programme d'arrosage par ID
exports.getProgrammeArrosageById = async (req, res) => {
  const { id } = req.params;

  try {
    const programme = await ProgrammeArrosage.findById(id);
    if (!programme) {
      return res.status(404).json({ message: 'Programme d\'arrosage non trouvé.' });
    }
    res.status(200).json(programme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un programme d'arrosage
exports.updateProgrammeArrosage = async (req, res) => {
  const { id } = req.params;
  const { heureArrosage, dateArrosage, quantiteEau } = req.body;

  try {
    const updatedProgramme = await ProgrammeArrosage.findByIdAndUpdate(
      id,
      { heureArrosage, dateArrosage, quantiteEau },
      { new: true }
    );

    if (!updatedProgramme) {
      return res.status(404).json({ message: 'Programme d\'arrosage non trouvé.' });
    }

    res.status(200).json(updatedProgramme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un programme d'arrosage
exports.deleteProgrammeArrosage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProgramme = await ProgrammeArrosage.findByIdAndDelete(id);
    if (!deletedProgramme) {
      return res.status(404).json({ message: 'Programme d\'arrosage non trouvé.' });
    }

    res.status(200).json({ message: 'Programme d\'arrosage supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/// Archiver un programme d'arrosage (mettre le status à 'inactif')
exports.archiverProgrammeArrosage = async (req, res) => {
  const { id } = req.params;

  try {
    const programme = await ProgrammeArrosage.findById(id);
    if (!programme) {
      return res.status(404).json({ message: 'Programme d\'arrosage non trouvé.' });
    }

    // Si le programme est déjà inactif, il n'y a pas besoin de changer son status
    if (programme.status === 'inactif') {
      return res.status(400).json({ message: 'Ce programme est déjà archivé.' });
    }

    // Mettre à jour le statut en 'inactif'
    programme.status = 'inactif';
    await programme.save();

    res.status(200).json({ 
      message: 'Programme d\'arrosage archivé avec succès.',
      status: programme.status // Afficher le statut actuel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Désarchiver un programme d'arrosage (mettre le status à 'actif')
exports.desarchiverProgrammeArrosage = async (req, res) => {
  const { id } = req.params;

  try {
    const programme = await ProgrammeArrosage.findById(id);
    if (!programme) {
      return res.status(404).json({ message: 'Programme d\'arrosage non trouvé.' });
    }

    // Si le programme est déjà actif, il n'y a pas besoin de changer son status
    if (programme.status === 'actif') {
      return res.status(400).json({ message: 'Ce programme est déjà actif.' });
    }

    // Mettre à jour le statut en 'actif'
    programme.status = 'actif';
    await programme.save();

    res.status(200).json({ 
      message: 'Programme d\'arrosage désarchivé avec succès.',
      status: programme.status // Afficher le statut actuel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
