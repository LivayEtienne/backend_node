const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Utilisé pour générer un numéro de carte unique

// Définition du schéma pour Item
const itemSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères.'],
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères.'],
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Le numéro de téléphone doit contenir 10 chiffres.'],
    index: true,
  },
  adresse: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'utilisateur'],
    required: true,
    default: 'utilisateur',
  },
  numeroCarte: {
    type: String,
    unique: true,
    default: function () {
      return 'CARTE-' + uuidv4().slice(0, 8).toUpperCase(); // Génère un numéro unique court
    },
  },
  status: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
  code: {
    type: String,
    unique: true,
    required: true,  // Ce champ doit être affecté lors de l'inscription
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware pour mettre à jour `updatedAt` lors de la mise à jour
itemSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Exportation du modèle
module.exports = mongoose.model('Item', itemSchema);
