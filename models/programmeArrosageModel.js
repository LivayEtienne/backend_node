const mongoose = require('mongoose');

// Schéma du programme d'arrosage
const programmeArrosageSchema = new mongoose.Schema({
  heureArrosage: {
    type: String, // Heure de l'arrosage au format 'HH:mm'
    required: true
  },
  dateArrosage: {
    type: Date, // Date de l'arrosage
    required: true
  },
  quantiteEau: {
    type: Number, // Quantité d'eau en litres
    required: true
  },
  status: {
    type: String,
    enum: ['actif', 'inactif'], // Limite les valeurs possibles à 'actif' ou 'inactif'
    default: 'actif' // Par défaut, un programme est actif
  },
}, { timestamps: true }); // Ajout de timestamps pour la gestion des dates de création et de mise à jour

// Création du modèle
const ProgrammeArrosage = mongoose.model('ProgrammeArrosage', programmeArrosageSchema);

module.exports = ProgrammeArrosage;
