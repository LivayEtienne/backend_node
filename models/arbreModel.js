const mongoose = require('mongoose');

// Définition du schéma pour Arbre
const arbreSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Le nom de l\'arbre doit contenir au moins 2 caractères.'],
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  volumeEau: {
    type: Number,
    required: true,
    min: [0, 'Le volume d\'eau ne peut pas être négatif.'],
  },
  humidite: {
    type: Number,
    required: true,
    min: [0, 'L\'humidité ne peut pas être inférieure à 0%.'],
    max: [100, 'L\'humidité ne peut pas être supérieure à 100%.'],
  },
  luminosite: {
    type: String,
    required: true,
    enum: ['faible', 'modérée', 'élevée'], // Luminosité peut être faible, modérée ou élevée
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
});

// Middleware pour mettre à jour `updatedAt` lors de la mise à jour
arbreSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Exportation du modèle
module.exports = mongoose.model('Arbre', arbreSchema);
