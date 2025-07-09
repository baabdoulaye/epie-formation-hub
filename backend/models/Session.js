// backend/models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre de la session est requis."],
      trim: true,
      unique: true, // Assure que chaque session a un titre unique
    },
    formation: {
      // Correspond à 'formation' dans ton frontend
      type: String, // Gardé comme String pour correspondre à tes select options dans AddSessionForm.tsx
      required: [true, "La formation associée est requise."],
    },
    formateur: {
      // Correspond à 'formateur' dans ton frontend
      type: String, // Gardé comme String pour correspondre à tes select options dans AddSessionForm.tsx
      required: [true, "Le formateur est requis."],
    },
    dateDebut: {
      // Nommage corrigé pour correspondre au frontend
      type: Date,
      required: [true, "La date de début de la session est requise."],
    },
    dateFin: {
      // Nommage corrigé pour correspondre au frontend
      type: Date,
      required: [true, "La date de fin de la session est requise."],
      validate: {
        validator: function (value) {
          // La date de fin doit être égale ou postérieure à la date de début
          return value >= this.dateDebut;
        },
        message:
          "La date de fin doit être égale ou postérieure à la date de début.",
      },
    },
    heureDebut: {
      // Champ ajouté
      type: String, // Format "HH:MM"
      required: [true, "L'heure de début est requise."],
      match: [
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Le format de l'heure de début doit être HH:MM.",
      ],
    },
    heureFin: {
      // Champ ajouté
      type: String, // Format "HH:MM"
      required: [true, "L'heure de fin est requise."],
      match: [
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Le format de l'heure de fin doit être HH:MM.",
      ],
    },
    lieu: {
      // Champ ajouté
      type: String,
      required: [true, "Le lieu de la session est requis."],
      trim: true,
    },
    capaciteMax: {
      // Champ ajouté
      type: Number,
      required: [true, "La capacité maximale est requise."],
      min: [1, "La capacité maximale doit être d'au moins 1 participant."],
    },
    participantsInscrits: {
      // Champ ajouté
      type: Number,
      default: 0, // Commence à 0 participants
      min: [0, "Le nombre de participants inscrits ne peut pas être négatif."],
      validate: {
        validator: function (value) {
          // Le nombre de participants inscrits ne peut pas dépasser la capacité maximale
          return value <= this.capaciteMax;
        },
        message:
          "Le nombre de participants inscrits ne peut pas dépasser la capacité maximale.",
      },
    },
    statut: {
      // Champ ajouté
      type: String,
      enum: {
        values: ["Planifiée", "En cours", "Terminée", "Annulée"],
        message:
          "Le statut doit être 'Planifiée', 'En cours', 'Terminée' ou 'Annulée'.",
      },
      default: "Planifiée",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères."],
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

module.exports = mongoose.model("Session", sessionSchema);
