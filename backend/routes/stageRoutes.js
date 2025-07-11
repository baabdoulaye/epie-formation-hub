// backend/routes/stageRoutes.js
const express = require("express");
const router = express.Router();
// Importe les fonctions du contrôleur de stage
const {
  getStages,
  getStageById,
  createStage,
  updateStage,
  deleteStage,
} = require("../controllers/stageController"); // Assure-toi que le chemin est correct

// @route   GET /api/internships
// @desc    Get all internships (with optional sector filter)
// @access  Public
// Cette route appelle maintenant la fonction getStages du contrôleur
router.get("/", getStages);

// @route   GET /api/internships/:id
// @desc    Get single internship by ID
// @access  Public
// Cette route appelle maintenant la fonction getStageById du contrôleur
router.get("/:id", getStageById);

// @route   POST /api/internships
// @desc    Add a new internship
// @access  Public
// Cette route appelle maintenant la fonction createStage du contrôleur
router.post("/", createStage);

// @route   PUT /api/internships/:id
// @desc    Update an internship
// @access  Public
// Cette route appelle maintenant la fonction updateStage du contrôleur
router.put("/:id", updateStage);

// @route   DELETE /api/internships/:id
// @desc    Delete an internship
// @access  Public
// Cette route appelle maintenant la fonction deleteStage du contrôleur
router.delete("/:id", deleteStage);

module.exports = router;
