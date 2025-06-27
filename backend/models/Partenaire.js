// backend/models/Partner.js
const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    typePartenaire: { type: String, required: true },
    secteurActivite: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    siteWeb: { type: String, required: false }, // Optionnel
    description: { type: String, required: false }, // Optionnel
  },
  { timestamps: true }
); // Ajoute createdAt et updatedAt automatiquement

module.exports = mongoose.model("Partner", PartnerSchema);
