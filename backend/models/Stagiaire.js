// models/stagiaire.js
const mongoose = require("mongoose");

const stagiaireSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false, // Rendu optionnel
    },
    lastName: {
      type: String,
      required: false, // Rendu optionnel
    },
    email: {
      type: String,
      required: false, // Rendu optionnel
      // Tu peux ajouter une validation de format ici si tu le souhaites côté backend aussi
      // match: /^\S+@\S+\.\S+$/,
    },
    phone: {
      type: String,
      required: false, // Rendu optionnel
    },
    birthDate: {
      type: String, // Ou Date si tu préfères stocker comme objet Date
      required: false, // Rendu optionnel
    },
    age: {
      type: Number,
      required: false, // Rendu optionnel
    },
    address: {
      type: String,
      required: false, // Rendu optionnel
    },
    postalCode: {
      type: String,
      required: false, // Rendu optionnel
    },
    city: {
      type: String,
      required: false, // Rendu optionnel
    },
    department: {
      type: String,
      required: false, // Rendu optionnel
    },
    birthCity: {
      type: String,
      required: false, // Rendu optionnel
    },
    birthCountry: {
      type: String,
      required: false, // Rendu optionnel
      default: "France", // Valeur par défaut comme dans le formulaire
    },
    prescribingOrganization: {
      type: String,
      required: false, // Rendu optionnel
    },
    prescribingCity: {
      type: String,
      required: false, // Rendu optionnel
    },
    educationLevel: {
      type: String,
      required: false, // Rendu optionnel
    },
    infoCollectiveDate: {
      type: String, // Ou Date
      required: false, // Rendu optionnel
    },
    presentAtInfoCollective: {
      type: Boolean,
      required: false, // Rendu optionnel
      default: false,
    },
    presentAtIndividualInterview: {
      type: Boolean,
      required: false, // Rendu optionnel
      default: false,
    },
    positioning: {
      type: String,
      required: false, // Rendu optionnel
    },
    centerDecision: {
      type: String,
      required: false, // Rendu optionnel
    },
    result: {
      type: String,
      required: false, // Rendu optionnel
    },
    pathway1: {
      type: String,
      required: false, // Rendu optionnel
    },
    pathway2: {
      type: String,
      required: false, // Rendu optionnel
    },
    candidateInformation: {
      type: String,
      required: false, // Rendu optionnel
    },
  },
  { timestamps: true }
); // Ajoute createdAt et updatedAt automatiquement

module.exports = mongoose.model("Stagiaire", stagiaireSchema);
