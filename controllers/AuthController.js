const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

// Assurez-vous d'avoir créé ce modèle
const Item = mongoose.model('Item'); // Ou le nom de votre modèle correspondant

const JWT_SECRET = "jwt-secret";

const loginItem = async (req, res) => {
    const { carteRfid, codeSecret } = req.body;

    try {
        if (!carteRfid && !codeSecret) {
            return res.status(400).json({ msg: "Carte RFID ou code requis pour se connecter" });
        }

        // Création de la requête en fonction des informations fournies
        const query = carteRfid ? { carteRfid } : { codeSecret };

        // Utilisez findOne de Mongoose directement
        const item = await Item.findOne(query);

        if (!item) {
            return res.status(404).json({ msg: "Code ou Carte RfId inexistant" });
        }

        if (carteRfid) {
            if (carteRfid !== item.carteRfid) {
                return res.status(401).json({ msg: "Carte RFID inexistante" });
            }
        } else if (codeSecret) {
            if (codeSecret !== item.codeSecret) {
                return res.status(401).json({ msg: "Code secret incorrect" });
            }
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: item._id, role: item.role || "default" }, 
            JWT_SECRET, 
            { expiresIn: "8h" }
        );

        // Création du cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
        });

        return res.status(200).json({ msg: "Connexion réussie",nom: item.nom, prenom: item.prenom, role: item.role || "default" });
    } catch (error) {
        console.error("Erreur pendant la connexion :", error);
        return res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
};

module.exports = { loginItem };