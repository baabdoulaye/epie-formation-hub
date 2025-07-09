// backend/controllers/formationController.js

const Formation = require("../models/Formation"); // Assure-toi que le chemin est correct

// @desc    Obtenir toutes les formations
// @route   GET /api/formations
// @access  Public
exports.getFormations = async (req, res) => {
  try {
    const formations = await Formation.find();
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir une seule formation par ID
// @route   GET /api/formations/:id
// @access  Public
exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une nouvelle formation
// @route   POST /api/formations
// @access  Public (à adapter si authentification requise)
exports.createFormation = async (req, res) => {
  const { titre, description, categorie, duree, prerequis, objectifs } =
    req.body; // Validation simple des champs (tu peux ajouter plus de validation ici)

  if (!titre || !description || !categorie) {
    return res.status(400).json({
      message: "Le titre, la description et la catégorie sont requis.",
    });
  }

  const newFormation = new Formation({
    titre,
    description,
    categorie,
    duree,
    prerequis,
    objectifs,
  });

  try {
    const savedFormation = await newFormation.save();
    res.status(201).json(savedFormation);
  } catch (error) {
    // Gérer spécifiquement l'erreur de titre unique si besoin
    if (error.code === 11000 && error.keyPattern && error.keyPattern.titre) {
      return res
        .status(409)
        .json({ message: "Une formation avec ce titre existe déjà." });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mettre à jour une formation
// @route   PUT /api/formations/:id
// @access  Public (à adapter si authentification requise)
exports.updateFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    } // Mise à jour des champs // Object.assign(formation, req.body) permet de mettre à jour tous les champs envoyés dans req.body

    Object.assign(formation, req.body);

    const updatedFormation = await formation.save();
    res.status(200).json(updatedFormation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer une formation
// @route   DELETE /api/formations/:id
// @access  Public (à adapter si authentification requise)
exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    await Formation.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Formation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le nombre total de formations
// @route   GET /api/formations/count
// @access  Public
exports.countFormations = async (req, res) => {
  try {
    const count = await Formation.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    console.error("Erreur lors du comptage des formations:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors du comptage des formations." });
  }
};
