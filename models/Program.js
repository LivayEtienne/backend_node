const mongoose = require('mongoose');

// Définition du modèle de Programme
const ProgramSchema = new mongoose.Schema({
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',  // Référence au modèle Plant
        required: true
    },
    date: [String],  // Liste des dates sélectionnées pour l'arrosage
    periode: String,  // Période (ex. "Tous les jours")
    nombreFois: Number,  // Nombre de fois par jour
    arrosages: [
        {
            heure: String,  // Heure d'arrosage (ex. "08:00")
            volumeEau: Number,  // Volume d'eau en litres
            uniteVolume: String  // Unité de volume (L, ml, etc.)
        }
    ]
});

module.exports = mongoose.model('Program', ProgramSchema);
