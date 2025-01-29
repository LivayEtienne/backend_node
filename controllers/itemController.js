const Item = require('../models/itemsModel');

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
  const { nom, prenom, telephone, email } = req.body; // Récupérez les champs nécessaires
  try {
    // Créez un nouvel item avec les données fournies
    const newItem = await Item.create({ nom, prenom, telephone, email });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, telephone, email } = req.body; // Mettez à jour les bons champs
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { nom, prenom, telephone, email },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
