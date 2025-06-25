// backend/models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    civilite: {
      type: String,
      required: [true, "La civilité est requise"],
      enum: ["M.", "Mme"], // Limite les options à M. ou Mme
    },
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true, // Supprime les espaces blancs inutiles
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    poste: {
      type: String,
      required: [true, "Le poste est requis"],
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Le service est requis"],
      enum: ["Direction", "Pédagogie", "Administration", "Autres"], // Limite les options de service
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true, // Chaque email doit être unique
      trim: true,
      lowercase: true, // Stocke l'email en minuscules
      match: [/.+@.+\..+/, "Veuillez utiliser une adresse email valide"], // Validation du format email
    },
    telephone: {
      type: String,
      required: false, // Le téléphone n'est pas obligatoire
      trim: true,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
