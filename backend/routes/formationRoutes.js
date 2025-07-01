// backend/routes/formationRoutes.js
const express = require("express");
const router = express.Router();
const formationController = require("../controllers/formationController"); // On importera le contrôleur ici

// @route   GET /api/formations
// @desc    Obtenir toutes les formations
// @access  Public
router.get("/", formationController.getFormations);

// @route   GET /api/formations/:id
// @desc    Obtenir une seule formation par ID
// @access  Public
router.get("/:id", formationController.getFormationById);

// @route   POST /api/formations
// @desc    Créer une nouvelle formation
// @access  Public (à adapter si authentification requise)
router.post("/", formationController.createFormation);

// @route   PUT /api/formations/:id
// @desc    Mettre à jour une formation
// @access  Public (à adapter si authentification requise)
router.put("/:id", formationController.updateFormation);

// @route   DELETE /api/formations/:id
// @desc    Supprimer une formation
// @access  Public (à adapter si authentification requise)
router.delete("/:id", formationController.deleteFormation);

module.exports = router;
