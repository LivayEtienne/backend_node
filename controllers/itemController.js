const Item = require('../models/itemsModel');

// Fonction pour générer un numéro de carte unique (12 chiffres)
const generateCardNumber = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// Récupérer tous les items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un nouvel item
exports.createItem = async (req, res) => {
  const { nom, prenom, telephone, adresse, role, code } = req.body;

  // Vérification du rôle
  if (!['admin', 'utilisateur'].includes(role)) {
    return res.status(400).json({ message: "Le rôle doit être 'admin' ou 'utilisateur'." });
  }

  // Vérification que le code est fourni et est unique
  if (!code) {
    return res.status(400).json({ message: "Le code est requis." });
  }

  // Vérifier si le code est déjà utilisé
  const existingCode = await Item.findOne({ code });
  if (existingCode) {
    return res.status(400).json({ message: "Le code est déjà utilisé." });
  }

  try {
    // Création du nouvel item avec un numéro de carte généré automatiquement
    const newItem = await Item.create({
      nom,
      prenom,
      telephone,
      adresse,
      role,
      code,  // Le code est désormais fourni lors de l'inscription
      numeroCarte: generateCardNumber(), // Numéro de carte auto-généré
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, telephone, adresse, role } = req.body;

  // Vérification du rôle
  if (role && !['admin', 'utilisateur'].includes(role)) {
    return res.status(400).json({ message: "Le rôle doit être 'admin' ou 'utilisateur'." });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { nom, prenom, telephone, adresse, role },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Archiver un item (mettre son statut à 'inactif')
exports.archiveItem = async (req, res) => {
  const { id } = req.params;
  try {
    const archivedItem = await Item.findByIdAndUpdate(
      id,
      { status: 'inactif' },
      { new: true }
    );
    if (!archivedItem) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur archivé avec succès.', archivedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Désarchiver un utilisateur (remettre son statut à 'actif')
exports.unarchiveItem = async (req, res) => {
  const { id } = req.params;
  try {
    const unarchivedItem = await Item.findByIdAndUpdate(
      id,
      { status: 'actif' },
      { new: true }
    );
    if (!unarchivedItem) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur désarchivé avec succès.', unarchivedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.modifyUser = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Vérification si des champs sont envoyés
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour." });
  }

  // Mise à jour de `updatedAt`
  updateFields.updatedAt = Date.now();

  try {
    // Vérifier si le numéro de carte existe déjà s'il est fourni
    if (updateFields.numeroCarte) {
      const existingCard = await Item.findOne({ numeroCarte: updateFields.numeroCarte });
      if (existingCard && existingCard._id.toString() !== id) {
        return res.status(400).json({ message: "Ce numéro de carte est déjà utilisé." });
      }
    }

    const updatedUser = await Item.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true, // Appliquer les validations du modèle
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Utilisateur modifié avec succès.", updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Recherche et suppression de l'utilisateur par ID
    const deletedUser = await Item.findByIdAndDelete(id);

    // Si l'utilisateur n'est pas trouvé
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Si l'utilisateur est supprimé avec succès
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    // Si une erreur survient lors de la suppression
    res.status(500).json({ message: error.message });
  }
};
