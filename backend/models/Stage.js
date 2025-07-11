const mongoose = require("mongoose");

const stageSchema = mongoose.Schema(
  {
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stagiaire",
      required: false,
      default: null,
    },
    student_adresse: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    student_telephone: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    student_email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: null,
    },
    entreprise: {
      type: String,
      required: true,
      trim: true,
    },
    entreprise_adresse: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    entreprise_ville: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    entreprise_code_postal: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    secteur: {
      type: String,
      required: false,
      enum: [
        "Technologie",
        "Services",
        "Commerce",
        "Industrie",
        "Santé",
        "Finance",
        "Construction",
        null,
      ],
      default: null,
    },
    // NOUVEAU CHAMP : Formation suivie
    formation_suivie: {
      type: String,
      required: false,
      enum: [
        null, // Option pour "Aucune sélection" ou non spécifié
        "Parcours Sécurisé vers les métiers de l’informatique et du numérique",
        "Parcours d’Accès à la Qualification aux métiers de l’informatique et du numérique",
        "TP – Technicien(ne) Supérieur Système et Réseaux",
        "TP – Technicien(ne) Informatique de Proximité",
        "TP – Technicien(ne) Réseaux IP",
        "DéClics Numériques",
        "Parcours Sécurisé vers les métiers de l’Accueil et du Secrétariat",
        "CléA",
      ],
      default: null,
    },
    tuteur_entreprise: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    email_tuteur: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: null,
    },
    telephone_tuteur: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    date_debut: {
      type: Date,
      required: true,
    },
    date_fin: {
      type: Date,
      required: true,
    },
    duree_semaines: {
      type: Number,
      required: false,
      default: null,
    },
    objectifs: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    competences_visees: {
      type: [String],
      required: false,
      default: [],
    },
    statut: {
      type: String,
      enum: ["En cours", "Terminé", "Planifié"],
    },
    evaluation: {
      type: String,
      required: false,
      default: null,
    },
    commentaires: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pour calculer duree_semaines avant la sauvegarde si les dates sont présentes
stageSchema.pre("save", function (next) {
  if (
    this.date_debut instanceof Date &&
    this.date_fin instanceof Date &&
    !isNaN(this.date_debut.getTime()) &&
    !isNaN(this.date_fin.getTime()) &&
    (this.isModified("date_debut") || this.isModified("date_fin") || this.isNew)
  ) {
    const diffTime = Math.abs(
      this.date_fin.getTime() - this.date_debut.getTime()
    );
    this.duree_semaines = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }
  next();
});

const Stage = mongoose.model("Stage", stageSchema);

module.exports = Stage;
