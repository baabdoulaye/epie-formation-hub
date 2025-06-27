// backend/routes/partners.js
const express = require("express");
const router = express.Router();
const Partner = require("../models/Partenaire"); // Assure-toi que le chemin vers Partner.js est correct

// GET tous les partenaires
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un seul partenaire par ID
router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner)
      return res.status(404).json({ message: "Partenaire non trouvé" });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST créer un nouveau partenaire
router.post("/", async (req, res) => {
  const partner = new Partner({
    nom: req.body.nom,
    typePartenaire: req.body.typePartenaire,
    secteurActivite: req.body.secteurActivite,
    ville: req.body.ville,
    codePostal: req.body.codePostal,
    siteWeb: req.body.siteWeb,
    description: req.body.description,
  });
  try {
    const newPartner = await partner.save();
    res.status(201).json(newPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT mettre à jour un partenaire
router.put("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner)
      return res.status(404).json({ message: "Partenaire non trouvé" });

    // Mise à jour des champs si ils sont présents dans la requête
    if (req.body.nom != null) partner.nom = req.body.nom;
    if (req.body.typePartenaire != null)
      partner.typePartenaire = req.body.typePartenaire;
    if (req.body.secteurActivite != null)
      partner.secteurActivite = req.body.secteurActivite;
    if (req.body.ville != null) partner.ville = req.body.ville;
    if (req.body.codePostal != null) partner.codePostal = req.body.codePostal;
    if (req.body.siteWeb != null) partner.siteWeb = req.body.siteWeb;
    if (req.body.description != null)
      partner.description = req.body.description;

    const updatedPartner = await partner.save();
    res.json(updatedPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE un partenaire
router.delete("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner)
      return res.status(404).json({ message: "Partenaire non trouvé" });

    await Partner.deleteOne({ _id: req.params.id });
    res.json({ message: "Partenaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
