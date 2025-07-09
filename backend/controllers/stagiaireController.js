// backend/controllers/stagiaireController.js
const Stagiaire = require("../models/Stagiaire");

// Fonction pour créer un nouveau stagiaire
exports.createStagiaire = async (req, res) => {
  try {
    const newStagiaire = new Stagiaire(req.body);
    const savedStagiaire = await newStagiaire.save();
    res.status(201).json(savedStagiaire);
  } catch (error) {
    console.error("Erreur lors de la création du stagiaire:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour obtenir tous les stagiaires
exports.getAllStagiaires = async (req, res) => {
  try {
    const stagiaires = await Stagiaire.find();
    res.status(200).json(stagiaires);
  } catch (error) {
    console.error("Erreur lors de la récupération des stagiaires:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

// Fonction pour obtenir un stagiaire par ID
exports.getStagiaireById = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.status(200).json(stagiaire);
  } catch (error) {
    console.error("Erreur lors de la récupération du stagiaire par ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour mettre à jour un stagiaire par ID
exports.updateStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.status(200).json(stagiaire);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stagiaire:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour supprimer un stagiaire par ID
exports.deleteStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }
    res.status(200).json({ message: "Stagiaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du stagiaire:", error);
    res.status(500).json({ message: error.message });
  }
};

// Nouvelle fonction pour compter les stagiaires
exports.countStagiaires = async (req, res) => {
  try {
    const count = await Stagiaire.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    console.error("Erreur lors du comptage des stagiaires:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors du comptage des stagiaires." });
  }
};
