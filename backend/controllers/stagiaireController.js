// controllers/stagiaireController.js
const Stagiaire = require("../models/stagiaire");

// Créer un nouveau stagiaire
exports.createStagiaire = async (req, res) => {
  try {
    const stagiaire = new Stagiaire(req.body);
    await stagiaire.save();
    res.status(201).json(stagiaire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les stagiaires
exports.getAllStagiaires = async (req, res) => {
  try {
    const stagiaires = await Stagiaire.find();
    res.json(stagiaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un stagiaire par ID
exports.getStagiaireById = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.json(stagiaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un stagiaire par ID
exports.updateStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.json(stagiaire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un stagiaire par ID
exports.deleteStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.json({ message: "Stagiaire supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
