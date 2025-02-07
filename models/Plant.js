const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  nom: String,
  category: String,
  photo: String,
  seuilHumidity: Number,
  seuilLuminosity: Number,
  volumeEau: Number,
  eauUnit: String,
 /* programmes: [ // Ajouter cette ligne pour associer des programmes à chaque plante
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programs'  // Référence à la collection Program
    }
  ] */
});

// Activer les getters lors de la conversion en JSON
plantSchema.set('toJSON', { getters: true });

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;
