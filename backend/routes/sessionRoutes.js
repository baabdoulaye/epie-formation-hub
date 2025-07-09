// backend/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController"); // Assure-toi que ce contrôleur existe

// Important : la route /count doit être placée avant la route /:id
// Sinon, 'count' pourrait être interprété comme un ID de session.

// @route   GET /api/sessions/count
// @desc    Obtenir le nombre total de sessions
router.get("/count", sessionController.countSessions);

// @route   GET /api/sessions
// @desc    Obtenir toutes les sessions
// @route   POST /api/sessions
// @desc    Créer une nouvelle session
router
  .route("/")
  .get(sessionController.getAllSessions)
  .post(sessionController.createSession);

// @route   GET /api/sessions/:id
// @desc    Obtenir une session par ID
// @route   PUT /api/sessions/:id
// @desc    Mettre à jour une session
// @route   DELETE /api/sessions/:id
// @desc    Supprimer une session
router
  .route("/:id")
  .get(sessionController.getSessionById)
  .put(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = router;
