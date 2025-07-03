// routes/stagiaireRoutes.js
const express = require("express");
const router = express.Router();
const stagiaireController = require("../controllers/stagiaireController");

// Route pour créer un nouveau stagiaire
router.post("/", stagiaireController.createStagiaire);

// Route pour obtenir tous les stagiaires
router.get("/", stagiaireController.getAllStagiaires);

// Route pour obtenir un stagiaire par ID
router.get("/:id", stagiaireController.getStagiaireById);

// Route pour mettre à jour un stagiaire par ID
router.put("/:id", stagiaireController.updateStagiaire);

// Route pour supprimer un stagiaire par ID
router.delete("/:id", stagiaireController.deleteStagiaire);

module.exports = router;
