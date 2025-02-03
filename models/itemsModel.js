// models/Item.js
const mongoose = require('mongoose');

// Fonction pour générer un code secret aléatoire de 4 chiffres
const generateCodeSecret = () => {
    return Math.floor(1000 + Math.random() * 9000); // Génère un nombre entre 1000 et 9999
};

const itemSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    codeSecret: { type: Number, required: true, unique: true, default: generateCodeSecret }, // Champ modifié
    carteRfid: { type: String, required: true, unique: true },
    telephone: { type: Number, required: true, unique: true },
    adresse: { type: String, required: true }, // Champ ajouté
    role: { type: String, enum: ['Utilisateur', 'Super Admin'], required: true }, // Champ ajouté
    status: { type: Boolean, default: true }, // Par défaut, le statut est vrai
    createdAt: { type: Date, default: Date.now },
});

// Middleware pour s'assurer que le code secret est unique
itemSchema.pre('save', async function(next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const code = generateCodeSecret();
            const existingItem = await this.constructor.findOne({ codeSecret: code });
            if (!existingItem) {
                this.codeSecret = code;
                isUnique = true;
            }
        }
    }
    next();
});

module.exports = mongoose.model('Item', itemSchema);