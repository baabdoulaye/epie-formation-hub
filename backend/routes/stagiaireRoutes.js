// backend/routes/stagiaireRoutes.js
const express = require("express");
const router = express.Router();
const stagiaireController = require("../controllers/stagiaireController");

// Route pour créer un nouveau stagiaire
router.post("/", stagiaireController.createStagiaire);

// Nouvelle route pour obtenir le nombre total de stagiaires (si elle existe dans ton contrôleur)
// Il faut l'ajouter si elle n'y est pas encore
router.get("/count", stagiaireController.countStagiaires); // Assure-toi que countStagiaires existe dans ton contrôleur

// Route pour obtenir tous les stagiaires (doit être après les routes spécifiques comme /count si tu en as d'autres)
router.get("/", stagiaireController.getAllStagiaires);

// Route pour obtenir un stagiaire par ID (doit être APRES /count et les autres routes spécifiques)
router.get("/:id", stagiaireController.getStagiaireById);

// Route pour mettre à jour un stagiaire par ID
router.put("/:id", stagiaireController.updateStagiaire);

// Route pour supprimer un stagiaire par ID
router.delete("/:id", stagiaireController.deleteStagiaire);

module.exports = router;
