// backend/controllers/stageController.js
const Stage = require("../models/Stage"); // Assure-toi que le chemin vers ton modèle Stage est correct

console.log("DEBUG: fichier stageController chargé !");

// Utility function to determine the status of an internship
const getStageStatus = (dateDebut, dateFin) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Current day at midnight

  const stageDebutDay = new Date(
    new Date(dateDebut).getFullYear(),
    new Date(dateDebut).getMonth(),
    new Date(dateDebut).getDate()
  );
  const stageFinDay = new Date(
    new Date(dateFin).getFullYear(),
    new Date(dateFin).getMonth(),
    new Date(dateFin).getDate()
  );

  if (stageFinDay < today) {
    return "Terminé";
  } else if (stageDebutDay <= today && stageFinDay >= today) {
    return "En cours";
  } else {
    return "Planifié";
  }
};

// @desc    Get all stages
// @route   GET /api/internships
// @access  Public
const getStages = async (req, res) => {
  try {
    const { secteur } = req.query; // Récupère le paramètre de filtre 'secteur' de la requête
    console.log("DEBUG: Paramètre de requête 'secteur' reçu:", secteur); // LOG DE DEBUG

    let query = {}; // Initialise un objet de requête vide

    // Si un secteur est fourni, ajoute-le à la requête
    if (secteur && secteur !== "Tous") {
      query.secteur = secteur;
    }
    console.log("DEBUG: Objet de requête MongoDB généré:", query); // LOG DE DEBUG

    let stages = await Stage.find(query); // Utilise l'objet de requête pour filtrer
    console.log(
      "DEBUG: Stages trouvés (avant calcul du statut):",
      stages.map((s) => ({
        _id: s._id,
        student_name: s.student_name,
        entreprise: s.entreprise,
        secteur: s.secteur,
        formation_suivie: s.formation_suivie, // Inclure pour le debug
      }))
    ); // LOG DE DEBUG

    // Update the status of each stage before sending it to the client
    stages = stages.map((stage) => {
      const stageObj = stage.toObject(); // Convert Mongoose document to plain JS object
      stageObj.statut = getStageStatus(stageObj.date_debut, stageObj.date_fin);
      return stageObj;
    });

    res.json(stages);
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stage by ID
// @route   GET /api/internships/:id
// @access  Public
const getStageById = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);
    if (stage) {
      const stageObj = stage.toObject(); // Convert Mongoose document to plain JS object
      stageObj.statut = getStageStatus(stageObj.date_debut, stageObj.date_fin);
      res.json(stageObj); // Send the updated object
    } else {
      res.status(404).json({ message: "Stage not found" });
    }
  } catch (error) {
    console.error("Error fetching stage by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new stage
// @route   POST /api/internships
// @access  Public
const createStage = async (req, res) => {
  const {
    student_name,
    student_adresse,
    student_telephone,
    student_email,
    entreprise,
    entreprise_adresse,
    entreprise_ville,
    entreprise_code_postal,
    secteur,
    formation_suivie, // NOUVEAU: Ajout de formation_suivie
    tuteur_entreprise,
    email_tuteur,
    telephone_tuteur,
    date_debut,
    date_fin,
    objectifs,
    competences_visees,
    evaluation,
    commentaires,
  } = req.body;

  // Calculate status automatically based on dates
  const calculatedStatut = getStageStatus(date_debut, date_fin);

  try {
    const newStage = new Stage({
      student_name,
      student_adresse,
      student_telephone,
      student_email,
      entreprise,
      entreprise_adresse,
      entreprise_ville,
      entreprise_code_postal,
      secteur,
      formation_suivie, // NOUVEAU: Inclure formation_suivie
      tuteur_entreprise,
      email_tuteur,
      telephone_tuteur,
      date_debut: new Date(date_debut),
      date_fin: new Date(date_fin),
      objectifs,
      competences_visees: competences_visees || [],
      statut: calculatedStatut, // Assign the automatically calculated status
      evaluation: evaluation || null,
      commentaires,
    });

    const createdStage = await newStage.save();
    res.status(201).json(createdStage);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation error", details: messages });
    }
    console.error("Error creating stage:", error);
    res.status(500).json({ message: "Server error during stage creation" });
  }
};

// @desc    Update an existing stage
// @route   PUT /api/internships/:id
// @access  Public
const updateStage = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);

    if (stage) {
      // Mise à jour des champs existants
      if (req.body.student_name !== undefined)
        stage.student_name = req.body.student_name;
      if (req.body.entreprise !== undefined)
        stage.entreprise = req.body.entreprise;
      if (req.body.tuteur_entreprise !== undefined)
        stage.tuteur_entreprise = req.body.tuteur_entreprise;
      if (req.body.email_tuteur !== undefined)
        stage.email_tuteur = req.body.email_tuteur;
      if (req.body.telephone_tuteur !== undefined)
        stage.telephone_tuteur = req.body.telephone_tuteur;
      if (req.body.objectifs !== undefined)
        stage.objectifs = req.body.objectifs;
      if (req.body.competences_visees !== undefined)
        stage.competences_visees = req.body.competences_visees;
      if (req.body.evaluation !== undefined)
        stage.evaluation = req.body.evaluation;
      if (req.body.commentaires !== undefined)
        stage.commentaires = req.body.commentaires;

      // Mise à jour des champs pour le stagiaire
      if (req.body.student_adresse !== undefined)
        stage.student_adresse = req.body.student_adresse;
      if (req.body.student_telephone !== undefined)
        stage.student_telephone = req.body.student_telephone;
      if (req.body.student_email !== undefined)
        stage.student_email = req.body.student_email;

      // Mise à jour des champs pour l'entreprise
      if (req.body.entreprise_adresse !== undefined)
        stage.entreprise_adresse = req.body.entreprise_adresse;
      if (req.body.entreprise_ville !== undefined)
        stage.entreprise_ville = req.body.entreprise_ville;
      if (req.body.entreprise_code_postal !== undefined)
        stage.entreprise_code_postal = req.body.entreprise_code_postal;
      if (req.body.secteur !== undefined) stage.secteur = req.body.secteur;
      if (req.body.formation_suivie !== undefined)
        stage.formation_suivie = req.body.formation_suivie; // NOUVEAU

      // Convert dates explicitly and then recalculate status
      let updatedDateDebut = stage.date_debut;
      let updatedDateFin = stage.date_fin;

      if (req.body.date_debut !== undefined) {
        updatedDateDebut = new Date(req.body.date_debut);
        stage.date_debut = updatedDateDebut;
      }
      if (req.body.date_fin !== undefined) {
        updatedDateFin = new Date(req.body.date_fin);
        stage.date_fin = updatedDateFin;
      }

      // Recalculate status if dates were updated
      if (
        req.body.date_debut !== undefined ||
        req.body.date_fin !== undefined
      ) {
        stage.statut = getStageStatus(updatedDateDebut, updatedDateFin);
      }

      const updatedStage = await stage.save();
      res.json(updatedStage);
    } else {
      res.status(404).json({ message: "Stage not found" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error during update",
        details: messages,
      });
    }
    console.error("Error updating stage:", error);
    res.status(500).json({ message: "Server error during stage update" });
  }
};

// @desc    Delete a stage
// @route   DELETE /api/internships/:id
// @access  Public
const deleteStage = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);

    if (stage) {
      await Stage.deleteOne({ _id: req.params.id });
      res.json({ message: "Stage deleted successfully" });
    } else {
      res.status(404).json({ message: "Stage not found" });
    }
  } catch (error) {
    console.error("Error deleting stage:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStages,
  getStageById,
  createStage,
  updateStage,
  deleteStage,
};
