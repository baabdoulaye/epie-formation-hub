// backend/controllers/partenaireController.js

const Partenaire = require("../models/Partenaire"); // Assure-toi que le chemin est correct

// @desc    Obtenir tous les partenaires
// @route   GET /api/partners
// @access  Public
exports.getPartners = async (req, res) => {
  try {
    const partners = await Partenaire.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un seul partenaire
// @route   GET /api/partners/:id
// @access  Public
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partenaire.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un nouveau partenaire
// @route   POST /api/partners
// @access  Public (à adapter si authentification requise)
exports.createPartner = async (req, res) => {
  const {
    nom,
    typePartenaire,
    secteurActivite,
    ville,
    codePostal,
    siteWeb,
    description,
  } = req.body;

  // Validation simple des champs (tu peux ajouter plus de validation ici)
  if (!nom || !typePartenaire) {
    return res
      .status(400)
      .json({ message: "Le nom et le type de partenaire sont requis." });
  }

  const newPartner = new Partenaire({
    nom,
    typePartenaire,
    secteurActivite,
    ville,
    codePostal,
    siteWeb,
    description,
  });

  try {
    const savedPartner = await newPartner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mettre à jour un partenaire
// @route   PUT /api/partners/:id
// @access  Public (à adapter si authentification requise)
exports.updatePartner = async (req, res) => {
  try {
    const partner = await Partenaire.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }

    // Mise à jour des champs
    Object.assign(partner, req.body); // Met à jour tous les champs envoyés dans req.body

    const updatedPartner = await partner.save();
    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer un partenaire
// @route   DELETE /api/partners/:id
// @access  Public (à adapter si authentification requise)
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partenaire.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }

    await Partenaire.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Partenaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
