// backend/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Wrapper pour gérer les erreurs asynchrones
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Important : les routes spécifiques (comme /count ou /recent)
// doivent être placées avant les routes avec des paramètres dynamiques (comme /:id)
// afin que "count" ou "recent" ne soient pas interprétés comme un ID de session.

// @route   GET /api/sessions/count
// @desc    Obtenir le nombre total de sessions
router.get("/count", asyncHandler(sessionController.countSessions));

// @route   GET /api/sessions/recent
// @desc    Obtenir les sessions récentes pour le tableau de bord
router.get("/recent", asyncHandler(sessionController.getRecentSessions));

// NOUVELLE ROUTE : Sessions par mois
// @route   GET /api/sessions/monthly-counts
// @desc    Obtenir le nombre de sessions par mois pour le graphique
router.get(
  "/monthly-counts",
  asyncHandler(sessionController.getMonthlySessionCounts)
);

// @route   GET /api/sessions
// @desc    Obtenir toutes les sessions
// @route   POST /api/sessions
// @desc    Créer une nouvelle session
router
  .route("/")
  .get(asyncHandler(sessionController.getAllSessions))
  .post(asyncHandler(sessionController.createSession));

// @route   GET /api/sessions/:id
// @desc    Obtenir une session par ID
// @route   PUT /api/sessions/:id
// @desc    Mettre à jour une session
// @route   DELETE /api/sessions/:id
// @desc    Supprimer une session
router
  .route("/:id")
  .get(asyncHandler(sessionController.getSessionById))
  .put(asyncHandler(sessionController.updateSession))
  .delete(asyncHandler(sessionController.deleteSession));

module.exports = router;
