const Program = require('../models/Program');
const Plant = require('../models/Plant');

// Ajouter une nouvelle programmation et l'associer à une plante
exports.addProgram = async (req, res) => {
    try {
        const { plantId, date, periode, nombreFois, arrosages } = req.body;

        // Vérification que l'ID de la plante est bien inclus dans les données
        if (!plantId) {
            return res.status(400).json({ error: "L'ID de la plante est requis" });
        }

        // Vérification de la validité des données 'arrosages'
        if (!arrosages || arrosages.length !== nombreFois) {
            return res.status(400).json({
                error: `'arrosages' doit être défini et sa longueur doit être égale à 'nombreFois'`
            });
        }

        // Récupérer la plante à partir de l'ID
        const plant = await Plant.findById(plantId);
        if (!plant) {
            return res.status(404).json({ error: 'Plante non trouvée' });
        }

        // Créer un programme avec les données
        const newProgram = new Program({
            plantId,
            date,
            periode,
            nombreFois,
            arrosages
        });

        // Sauvegarder le programme
        await newProgram.save();

        res.status(201).json({ message: 'Programmation enregistrée avec succès !', program: newProgram });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement', details: error.message });
    }
};

// Récupérer toutes les programmations
exports.getPrograms = async (req, res) => {
    try {
        const programs = await Program.find().populate('plantId');
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des programmes', details: error.message });
    }
};

// Récupérer une programmation par son ID
exports.getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id).populate('plantId');
        if (!program) {
            return res.status(404).json({ error: 'Programmation non trouvée' });
        }
        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la programmation', details: error.message });
    }
};

// Modifier une programmation
exports.updateProgram = async (req, res) => {
    try {
      const { id } = req.params;  // L'ID du programme à mettre à jour
      const updatedData = req.body;  // Les données envoyées par la requête
  
      console.log('Program ID received:', id); // Vérifiez l'ID du programme reçu
      console.log('Updated data received:', updatedData); // Vérifiez les données reçues
  
      // Vérification que l'ID de la plante est bien inclus dans les données
      const { plantId, date, periode, nombreFois, arrosages } = updatedData;
  
      if (!plantId) {
        return res.status(400).json({ error: "L'ID de la plante est requis" });
      }
  
      // Vérification de la validité des données 'arrosages'
      if (!arrosages || arrosages.length !== nombreFois) {
        return res.status(400).json({
          error: `'arrosages' doit être défini et sa longueur doit être égale à 'nombreFois'`
        });
      }
  
      // Vérification que la plante existe bien dans la base de données
      const plant = await Plant.findById(plantId);
      if (!plant) {
        return res.status(404).json({ error: "Plante non trouvée" });
      }
  
      // Vérification que le programme existe dans la base de données
      const existingProgram = await Program.findById(id);
      if (!existingProgram) {
        return res.status(404).json({ error: "Programmation non trouvée" });
      }
  
      // Mettre à jour le programme
      const updatedProgram = await Program.findByIdAndUpdate(
        id,
        {
          ...updatedData, // On met à jour toutes les données de la programmation
          plantId: plantId  // On s'assure que l'ID de la plante est bien dans la programmation
        },
        { new: true } // Renvoie le document mis à jour
      );
  
      // Si la mise à jour échoue, renvoyer une erreur
      if (!updatedProgram) {
        return res.status(500).json({ error: "Erreur lors de la mise à jour du programme" });
      }
  
      // Réponse de succès
      res.status(200).json({
        message: "Programmation mise à jour avec succès !",
        updatedProgram
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour', details: error.message });
    }
  };
  

// Supprimer une programmation
exports.deleteProgram = async (req, res) => {
    try {
        const deletedProgram = await Program.findByIdAndDelete(req.params.id);
        if (!deletedProgram) {
            return res.status(404).json({ error: 'Programmation non trouvée' });
        }
        res.status(200).json({ message: 'Programmation supprimée avec succès !' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression', details: error.message });
    }
};

// Récupérer les programmes pour une plante spécifique
exports.getProgramsByPlantId = async (req, res) => {
    try {
        const plantId = req.params.plantId;
        const programs = await Program.find({ plantId });
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des programmes', details: error.message });
    }
};
