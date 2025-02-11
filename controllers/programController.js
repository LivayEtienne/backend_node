const Program = require('../models/Program');
const Plant = require('../models/Plant');
const cron = require('node-cron');
const axios = require('axios');

exports.scheduleWatering = async (req, res) => {
    try {
        const { plantId, date, periode, nombreFois, arrosages } = req.body;

        console.log('Données reçues:', { plantId, date, periode, nombreFois, arrosages });

        if (!plantId || !periode || !arrosages || arrosages.length === 0) {
            return res.status(400).json({ error: "Données manquantes pour planifier l'arrosage." });
        }

        const validPeriods = ['Tous les jours', 'Tous les 2 jours', 'Pendant un mois'];
        if (!validPeriods.includes(periode)) {
            return res.status(400).json({ error: "Période non valide." });
        }

        // Planification des arrosages
        arrosages.forEach(arrosage => {
            const { heure, volumeEau, uniteVolume } = arrosage;
            let cronSchedule = '';

            console.log('Arrosage en cours de planification:', { heure, volumeEau, uniteVolume });

            // Validation de l'heure (format HH:MM)
            if (!/^\d{2}:\d{2}$/.test(heure)) {
                return res.status(400).json({ error: `L'heure ${heure} est invalide.` });
            }

            // Validation des volumes
            if (volumeEau <= 0) {
                return res.status(400).json({ error: 'Le volume d\'eau doit être supérieur à 0.' });
            }

            // Génération de l'expression cron
            switch (periode) {
                case 'Tous les jours':
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} * * *`;
                    break;
                case 'Tous les 2 jours':
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} */2 * *`;
                    break;
                case 'Pendant un mois':
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} * * *`;
                    break;
                default:
                    return res.status(400).json({ error: `Période non valide: ${periode}` });
            }

            console.log('Expression cron générée:', cronSchedule);

            // Planification avec node-cron
            cron.schedule(cronSchedule, async () => {
                try {
                    console.log(`Arrosage de la plante ${plantId} à ${heure} avec ${volumeEau} ${uniteVolume}`);
                    const response = await axios.post(`http://<RaspberryPi_IP>/start_arrosage`, {
                        plantId,
                        heure,
                        volumeEau,
                        uniteVolume
                    });
                    console.log('Réponse du Raspberry Pi:', response.data);
                } catch (error) {
                    console.error('Erreur lors de l\'envoi au Raspberry Pi:', error.message);
                }
            });
        });

        return res.status(200).json({ message: 'Arrosages planifiés avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la planification des arrosages:', error);
        return res.status(500).json({ error: 'Erreur lors de la planification des arrosages', details: error.message });
    }
};

exports.addProgram = async (req, res) => {
    try {
        const { plantId, date, periode, nombreFois, arrosages } = req.body;

        console.log('Données reçues:', { plantId, date, periode, nombreFois, arrosages });

        if (!plantId) {
            return res.status(400).json({ error: "L'ID de la plante est requis" });
        }

        if (!arrosages || arrosages.length !== nombreFois) {
            return res.status(400).json({
                error: `'arrosages' doit être défini et sa longueur doit être égale à 'nombreFois'`
            });
        }

        const plant = await Plant.findById(plantId);
        if (!plant) {
            return res.status(404).json({ error: 'Plante non trouvée' });
        }

        const newProgram = new Program({
            plantId,
            date,
            periode,
            nombreFois,
            arrosages
        });

        await newProgram.save();

        // Appeler la méthode pour planifier l'arrosage sans envoyer de réponse
        await exports.scheduleWateringInternal(req.body);

        return res.status(201).json({ message: 'Programmation enregistrée avec succès !', program: newProgram });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement', details: error.message });
    }
};

// Méthode interne pour planifier l'arrosage sans envoyer de réponse
exports.scheduleWateringInternal = async (data) => {
    try {
        const { plantId, date, periode, nombreFois, arrosages } = data;

        console.log('Données reçues pour la planification:', { plantId, date, periode, nombreFois, arrosages });

        // Vérifier que toutes les propriétés nécessaires sont définies
        if (!plantId || !periode || !arrosages || arrosages.length === 0) {
            throw new Error("Données manquantes pour planifier l'arrosage.");
        }

        // Vérifier la validité de la période avant de planifier
        const validPeriods = ['Tous les jours', 'Tous les 2 jours', 'Pendant un mois'];
        if (!validPeriods.includes(periode)) {
            throw new Error("Période non valide.");
        }

        // Planifier chaque arrosage en fonction de la période
        arrosages.forEach(arrosage => {
            const { heure, volumeEau, uniteVolume } = arrosage;
            let cronSchedule = '';

            console.log('Arrosage en cours de planification:', { heure, volumeEau, uniteVolume });

            // Vérifier que l'heure est au bon format
            if (!/^\d{2}:\d{2}$/.test(heure)) {
                console.error(`Heure invalide: ${heure}`);
                return;
            }

            // Définir le planning en fonction de la période
            switch (periode) {
                case 'Tous les jours':
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} * * *`; // Tous les jours à l'heure spécifiée
                    break;
                case 'Tous les 2 jours':
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} */2 * *`; // Tous les 2 jours à l'heure spécifiée
                    break;
                case 'Pendant un mois':
                    // Planifier tous les jours pendant un mois
                    cronSchedule = `${heure.split(':')[1]} ${heure.split(':')[0]} * * *`;
                    // Vous devrez gérer l'arrêt après un mois dans votre logique
                    break;
            }

            console.log(`Planification de l'arrosage pour ${plantId} à ${heure} avec l'expression cron: ${cronSchedule}`);

            // Utiliser node-cron pour exécuter une tâche à l'heure de l'arrosage
            cron.schedule(cronSchedule, async () => {
                console.log(`Arrosage de la plante ${plantId} à ${heure} avec ${volumeEau} ${uniteVolume}`);

                // Exemple : envoyer une requête HTTP au Raspberry Pi pour démarrer l'arrosage
                try {
                    const response = await axios.post(`http://192.168.1.94/start_arrosage`, {
                        plantId,
                        heure,
                        volumeEau,
                        uniteVolume
                    });
                    console.log('Réponse du Raspberry Pi:', response.data);
                } catch (error) {
                    console.error('Erreur lors de l\'envoi au Raspberry Pi:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Erreur lors de la planification des arrosages:', error);
        throw error;
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
