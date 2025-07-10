const express = require("express");
const router = express.Router();
const Stage = require("../models/stage"); // Assure-toi que le chemin est correct

// Middleware pour gérer les erreurs et envoyer une réponse JSON standardisée
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stages = await Stage.find({});
    res.json(stages);
  })
);

// @route   GET /api/internships/:id
// @desc    Get single internship by ID
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const stage = await Stage.findById(req.params.id);
    if (stage) {
      res.json(stage);
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  })
);

// @route   POST /api/internships
// @desc    Add a new internship
// @access  Public
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      student_name, // NOUVEAU : Ajout de student_name ici
      entreprise,
      tuteur_entreprise,
      email_tuteur,
      telephone_tuteur,
      date_debut,
      date_fin,
      // duree_semaines, // Supprimé de la déstructuration car calculé par le middleware
      objectifs,
      // competences_visees, // Supprimé si non utilisé par le frontend
      statut,
      // evaluation, // Supprimé si non utilisé par le frontend
      commentaires,
    } = req.body;

    const newStage = new Stage({
      student_name, // NOUVEAU : Assignation de student_name
      // student_id: null, // Si tu ne l'utilises plus du tout, tu peux le laisser à null ou le supprimer entièrement du modèle
      entreprise,
      tuteur_entreprise,
      email_tuteur,
      telephone_tuteur,
      date_debut,
      date_fin,
      // duree_semaines: null, // Sera calculé par le middleware, pas besoin de l'assigner ici
      objectifs,
      // competences_visees: [], // Si tu ne l'utilises plus, retire-le. Sinon, initie un tableau vide.
      statut,
      // evaluation: null, // Si tu ne l'utilises plus, retire-le
      commentaires,
    });

    try {
      const createdStage = await newStage.save();
      res.status(201).json(createdStage);
    } catch (error) {
      // Gérer spécifiquement les erreurs de validation Mongoose
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res
          .status(400)
          .json({ message: "Erreur de validation", details: messages });
      }
      // Autres erreurs
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la création du stage" });
    }
  })
);

// @route   PUT /api/internships/:id
// @desc    Update an internship
// @access  Public
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const {
      student_name, // NOUVEAU : Ajout de student_name ici
      entreprise,
      tuteur_entreprise,
      email_tuteur,
      telephone_tuteur,
      date_debut,
      date_fin,
      // duree_semaines, // Supprimé
      objectifs,
      // competences_visees, // Supprimé
      statut,
      // evaluation, // Supprimé
      commentaires,
    } = req.body;

    const stage = await Stage.findById(req.params.id);

    if (stage) {
      // stage.student_id = student_id !== undefined ? student_id : stage.student_id; // Si tu gardes student_id mais qu'il peut être null
      stage.student_name =
        student_name !== undefined ? student_name : stage.student_name; // NOUVEAU : Mise à jour de student_name
      stage.entreprise =
        entreprise !== undefined ? entreprise : stage.entreprise;
      stage.tuteur_entreprise =
        tuteur_entreprise !== undefined
          ? tuteur_entreprise
          : stage.tuteur_entreprise;
      stage.email_tuteur =
        email_tuteur !== undefined ? email_tuteur : stage.email_tuteur;
      stage.telephone_tuteur =
        telephone_tuteur !== undefined
          ? telephone_tuteur
          : stage.telephone_tuteur;

      // Assure-toi que les dates sont mises à jour comme des objets Date
      if (date_debut !== undefined) stage.date_debut = new Date(date_debut);
      if (date_fin !== undefined) stage.date_fin = new Date(date_fin);

      // stage.duree_semaines = duree_semaines !== undefined ? duree_semaines : stage.duree_semaines; // Supprimé
      stage.objectifs = objectifs !== undefined ? objectifs : stage.objectifs;
      // stage.competences_visees = competences_visees !== undefined ? competences_visees : stage.competences_visees; // Supprimé
      stage.statut = statut !== undefined ? statut : stage.statut;
      // stage.evaluation = evaluation !== undefined ? evaluation : stage.evaluation; // Supprimé
      stage.commentaires =
        commentaires !== undefined ? commentaires : stage.commentaires;

      try {
        const updatedStage = await stage.save();
        res.json(updatedStage);
      } catch (error) {
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(
            (err) => err.message
          );
          return res
            .status(400)
            .json({
              message: "Erreur de validation lors de la mise à jour",
              details: messages,
            });
        }
        console.error(error);
        res
          .status(500)
          .json({ message: "Erreur serveur lors de la mise à jour du stage" });
      }
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  })
);

// @route   DELETE /api/internships/:id
// @desc    Delete an internship
// @access  Public
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const stage = await Stage.findById(req.params.id);

    if (stage) {
      await Stage.deleteOne({ _id: req.params.id }); // Utilise deleteOne sur l'instance trouvée
      res.json({ message: "Stage supprimé" });
    } else {
      res.status(404).json({ message: "Stage non trouvé" });
    }
  })
);

module.exports = router;
