const Stage = require("../models/Stage"); // Assure-toi que le chemin vers ton modèle Stage est correct

// @desc    Get all stages
// @route   GET /api/internships
// @access  Public
const getStages = async (req, res) => {
  try {
    const stages = await Stage.find({});
    res.json(stages);
  } catch (error) {
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
      res.json(stage);
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new stage
// @route   POST /api/internships
// @access  Public
const createStage = async (req, res) => {
  const {
    // student_id, // Si tu ne l'attends pas du frontend à la création, ne le déstructure pas.
    student_name, // OUI : Ce champ est essentiel et requis par le modèle
    entreprise,
    tuteur_entreprise,
    email_tuteur,
    telephone_tuteur,
    date_debut,
    date_fin,
    objectifs,
    // competences_visees, // Si non envoyé par frontend, ne pas déstructurer
    statut,
    // evaluation, // Si non envoyé par frontend, ne pas déstructurer
    commentaires,
  } = req.body;

  try {
    const newStage = new Stage({
      // student_id: student_id || null, // Si tu veux quand même le passer s'il existe
      student_name, // AJOUTÉ
      entreprise,
      tuteur_entreprise,
      email_tuteur,
      telephone_tuteur,
      date_debut: date_debut ? new Date(date_debut) : undefined, // Convertir en Date, ou undefined si vide
      date_fin: date_fin ? new Date(date_fin) : undefined, // Convertir en Date, ou undefined si vide
      objectifs,
      // competences_visees: competences_visees || [], // Si tu veux un tableau vide par défaut
      statut,
      // evaluation: evaluation || null, // Si tu veux null par défaut
      commentaires,
    });

    const createdStage = await newStage.save();
    res.status(201).json(createdStage);
  } catch (error) {
    // Gérer spécifiquement les erreurs de validation Mongoose pour un feedback précis
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Erreur de validation", details: messages });
    }
    console.error("Erreur lors de la création du stage:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du stage" });
  }
};

// @desc    Update an existing stage
// @route   PUT /api/internships/:id
// @access  Public
const updateStage = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);

    if (stage) {
      // Mettre à jour champ par champ pour un meilleur contrôle et pour gérer les types (notamment Date)
      if (req.body.student_name !== undefined)
        stage.student_name = req.body.student_name;
      // if (req.body.student_id !== undefined) stage.student_id = req.body.student_id; // Si tu le gardes
      if (req.body.entreprise !== undefined)
        stage.entreprise = req.body.entreprise;
      if (req.body.tuteur_entreprise !== undefined)
        stage.tuteur_entreprise = req.body.tuteur_entreprise;
      if (req.body.email_tuteur !== undefined)
        stage.email_tuteur = req.body.email_tuteur;
      if (req.body.telephone_tuteur !== undefined)
        stage.telephone_tuteur = req.body.telephone_tuteur;

      // Conversion explicite des dates
      if (req.body.date_debut !== undefined)
        stage.date_debut = new Date(req.body.date_debut);
      if (req.body.date_fin !== undefined)
        stage.date_fin = new Date(req.body.date_fin);

      // Duree_semaines est calculée par le middleware pre('save')
      if (req.body.objectifs !== undefined)
        stage.objectifs = req.body.objectifs;
      // if (req.body.competences_visees !== undefined) stage.competences_visees = req.body.competences_visees;
      if (req.body.statut !== undefined) stage.statut = req.body.statut;
      // if (req.body.evaluation !== undefined) stage.evaluation = req.body.evaluation;
      if (req.body.commentaires !== undefined)
        stage.commentaires = req.body.commentaires;

      const updatedStage = await stage.save();
      res.json(updatedStage);
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Erreur de validation lors de la mise à jour",
        details: messages,
      });
    }
    console.error("Erreur lors de la mise à jour du stage:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du stage" });
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
      res.json({ message: "Stage supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  } catch (error) {
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
