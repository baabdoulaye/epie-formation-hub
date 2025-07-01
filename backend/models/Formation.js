// backend/models/Formation.js
const mongoose = require("mongoose");

const FormationSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre de la formation est requis"],
      trim: true,
      unique: true, // Assure que chaque titre de formation est unique
    },
    description: {
      type: String,
      required: [true, "La description de la formation est requise"],
    },
    categorie: {
      type: String,
      required: [true, "La catégorie est requise"],
      enum: [
        "Formations Numériques",
        "Socles de Compétences",
        "Formations Linguistiques",
        "Autres",
      ],
      message:
        "La catégorie doit être une des suivantes : Formations Numériques, Socles de Compétences, Formations Linguistiques, Autres",
    },
    duree: {
      // Durée en heures
      type: String, // Gardé en String pour la flexibilité (ex: "3 jours", "20 heures")
      required: false, // Rends-le optionnel si ce n'est pas toujours nécessaire
    },
    // Les champs 'prix' et 'formateur' ont été retirés comme demandé.
    prerequis: {
      type: [String], // Tableau de chaînes de caractères pour les prérequis
      default: [],
    },
    objectifs: {
      type: [String], // Tableau de chaînes de caractères pour les objectifs
      default: [],
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

module.exports = mongoose.model("Formation", FormationSchema);
