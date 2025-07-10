const mongoose = require("mongoose");

const stageSchema = mongoose.Schema(
  {
    student_name: {
      // NOUVEAU CHAMP
      type: String,
      required: true, // Le nom du stagiaire est maintenant requis
      trim: true,
    },
    student_id: {
      // Rendu non requis si le nom est manuel, ou à adapter si tu veux les deux.
      // Pour l'instant, je le laisse comme précédemment (non requis)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stagiaire", // Assurez-vous que 'Stagiaire' est le nom de votre modèle de stagiaire
      required: false, // Rendu optionnel car nous ajoutons un nom manuel
      default: null,
    },
    entreprise: {
      type: String,
      required: true,
      trim: true,
    },
    tuteur_entreprise: {
      type: String,
      required: false, // Rendu optionnel
      trim: true,
      default: null,
    },
    email_tuteur: {
      type: String,
      required: false, // Rendu optionnel
      trim: true,
      lowercase: true,
      default: null,
    },
    telephone_tuteur: {
      type: String,
      required: false, // Rendu optionnel
      trim: true,
      default: null,
    },
    date_debut: {
      type: Date,
      required: true, // Rendu requis
    },
    date_fin: {
      type: Date,
      required: true, // Rendu requis
    },
    duree_semaines: {
      type: Number,
      required: false, // Rendu optionnel
      default: null, // Peut être null si non renseigné
    },
    objectifs: {
      type: String,
      required: false, // Rendu optionnel
      trim: true,
      default: null,
    },
    competences_visees: {
      type: [String], // Tableau de chaînes de caractères
      required: false, // Rendu optionnel
      default: [], // Par défaut un tableau vide
    },
    statut: {
      type: String,
      enum: ["En cours", "Terminé", "Annulé"],
      default: "En cours",
    },
    evaluation: {
      type: String, // Type String comme tu l'as mis. Si tu ne l'utilises plus, retire-le.
      required: false, // Rendu optionnel
      default: null, // Peut être null
    },
    commentaires: {
      type: String,
      required: false, // Rendu optionnel
      default: null, // Peut être null
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Middleware pour calculer duree_semaines avant la sauvegarde si les dates sont présentes
stageSchema.pre("save", function (next) {
  // S'assurer que this.date_debut et this.date_fin sont des instances de Date valides
  if (
    this.date_debut instanceof Date &&
    this.date_fin instanceof Date &&
    !isNaN(this.date_debut.getTime()) && // Vérifie que ce sont des dates valides
    !isNaN(this.date_fin.getTime()) &&
    (this.isModified("date_debut") || this.isModified("date_fin") || this.isNew) // Calculer à la création aussi
  ) {
    const diffTime = Math.abs(
      this.date_fin.getTime() - this.date_debut.getTime()
    );
    // Convertir les millisecondes en semaines (1 semaine = 7 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes)
    this.duree_semaines = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }
  next();
});

const Stage = mongoose.model("Stage", stageSchema);

module.exports = Stage;
