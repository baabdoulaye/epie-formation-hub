// backend/routes/partners.js
const express = require("express");
const router = express.Router();
const Partenaire = require("../models/Partenaire"); // Assure-toi que le chemin vers Partenaire.js est correct et que le nom du modèle est bien 'Partenaire'
const {
  getPartners,
  getPartnerById,
  createPartner, // Renommé de 'addPartner' si ton contrôleur l'a appelé 'createPartner'
  updatePartner,
  deletePartner,
  countPartners, // <-- NOUVELLE FONCTION IMPORTÉE
} = require("../controllers/partenaireController"); // Assure-toi que le chemin est correct et le nom du fichier est bien 'partenaireController'

// GET tous les partenaires
router.get("/", getPartners); // Utilise la fonction du contrôleur

// GET un seul partenaire par ID
router.get("/:id", getPartnerById); // Utilise la fonction du contrôleur

// POST créer un nouveau partenaire
router.post("/", createPartner); // Utilise la fonction du contrôleur

// PUT mettre à jour un partenaire
router.put("/:id", updatePartner); // Utilise la fonction du contrôleur

// DELETE un partenaire
router.delete("/:id", deletePartner); // Utilise la fonction du contrôleur

// Nouvelle route pour obtenir le nombre total de partenaires (NOUVEAU)
// GET /api/partners/count
router.get("/count", countPartners); // <-- NOUVELLE ROUTE ICI

module.exports = router;
