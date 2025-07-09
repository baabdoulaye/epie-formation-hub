// backend/routes/partners.js
const express = require("express");
const router = express.Router();
const Partenaire = require("../models/Partenaire");
const {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  countPartners,
} = require("../controllers/partenaireController");

// Nouvelle route pour obtenir le nombre total de partenaires (NOUVEAU)
// GET /api/partners/count
router.get("/count", countPartners); // <-- Déplacée ICI

// GET tous les partenaires
router.get("/", getPartners);

// GET un seul partenaire par ID
router.get("/:id", getPartnerById); // <-- EST MAINTENANT APRÈS /count

// POST créer un nouveau partenaire
router.post("/", createPartner);

// PUT mettre à jour un partenaire
router.put("/:id", updatePartner);

// DELETE un partenaire
router.delete("/:id", deletePartner);

module.exports = router;
