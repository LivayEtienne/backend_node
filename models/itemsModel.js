const mongoose = require('mongoose');

// Définition du schéma pour Item
const itemSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true, // Enlève les espaces avant et après
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true, // Doit être unique
    match: [/^\d{10}$/, 'Le numéro de téléphone doit contenir 10 chiffres.'], // Validation regex
  },
  email: {
    type: String,
    required: true,
    unique: true, // Doit être unique
    match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide"], // Validation regex
  },
});

// Exportation du modèle
module.exports = mongoose.model('Item', itemSchema);
