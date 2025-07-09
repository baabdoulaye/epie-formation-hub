// backend/controllers/sessionController.js
const Session = require("../models/Session"); // Assure-toi que ce modèle existe

// Fonction utilitaire pour déterminer le statut d'une session
const getSessionStatus = (dateDebut, dateFin) => {
  const now = new Date();
  // Créer des objets Date pour aujourd'hui, le début et la fin de la session,
  // en réinitialisant l'heure à minuit pour comparer uniquement les jours.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sessionDebutDay = new Date(
    new Date(dateDebut).getFullYear(),
    new Date(dateDebut).getMonth(),
    new Date(dateDebut).getDate()
  );
  const sessionFinDay = new Date(
    new Date(dateFin).getFullYear(),
    new Date(dateFin).getMonth(),
    new Date(dateFin).getDate()
  );

  if (sessionFinDay < today) {
    // Si la date de fin est strictement antérieure à aujourd'hui, la session est Terminée.
    return "Terminée";
  } else if (sessionDebutDay <= today && sessionFinDay >= today) {
    // Si la date de début est aujourd'hui ou passée, ET la date de fin est aujourd'hui ou future, la session est En cours.
    return "En cours";
  } else {
    // Sinon (si la date de début est future), la session est Planifiée.
    return "Planifiée";
  }
};

// @desc    Obtenir toutes les sessions
// @route   GET /api/sessions
// @access  Public
exports.getAllSessions = async (req, res) => {
  try {
    let sessions = await Session.find({}); // Récupère toutes les sessions

    // Parcourir chaque session pour mettre à jour son statut si nécessaire
    sessions = await Promise.all(
      sessions.map(async (session) => {
        // Si la session n'est pas manuellement "Annulée", recalcule son statut
        if (session.statut !== "Annulée") {
          const currentCalculatedStatus = getSessionStatus(
            session.dateDebut,
            session.dateFin
          );
          if (session.statut !== currentCalculatedStatus) {
            // Si le statut calculé est différent du statut actuel en DB, on le met à jour
            session.statut = currentCalculatedStatus;
            await session.save(); // Sauvegarde le changement dans la base de données
          }
        }
        return session; // Retourne la session (potentiellement mise à jour)
      })
    );

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des sessions.",
    });
  }
};

// @desc    Obtenir une seule session par ID
// @route   GET /api/sessions/:id
// @access  Public
exports.getSessionById = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id); // Utilise 'let' car l'objet 'session' sera modifié

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Mettre à jour le statut de la session avant de la renvoyer, sauf si elle est "Annulée"
    if (session.statut !== "Annulée") {
      const currentCalculatedStatus = getSessionStatus(
        session.dateDebut,
        session.dateFin
      );
      if (session.statut !== currentCalculatedStatus) {
        session.statut = currentCalculatedStatus;
        await session.save(); // Sauvegarde le changement
      }
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la session par ID:",
      error
    );
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de session invalide." });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la session.",
    });
  }
};

// @desc    Créer une nouvelle session
// @route   POST /api/sessions
// @access  Private (typiquement, la création serait restreinte)
exports.createSession = async (req, res) => {
  const {
    title,
    formateur,
    dateDebut,
    dateFin,
    heureDebut,
    heureFin,
    lieu,
    capaciteMax,
    description,
    participantsInscrits,
    // Note: 'statut' n'est plus directement utilisé pour l'initialisation auto
  } = req.body;

  // Validation basique côté contrôleur
  if (
    !title ||
    !formateur ||
    !dateDebut ||
    !dateFin ||
    !heureDebut ||
    !heureFin ||
    !lieu ||
    capaciteMax === undefined
  ) {
    return res.status(400).json({
      message:
        "Veuillez fournir tous les champs obligatoires : titre, formateur, dates, heures, lieu, capacité maximale.",
    });
  }

  // Validation spécifique pour participantsInscrits vs capaciteMax
  if (
    participantsInscrits !== undefined &&
    participantsInscrits > capaciteMax
  ) {
    return res.status(400).json({
      message:
        "Le nombre de participants inscrits ne peut pas dépasser la capacité maximale.",
    });
  }

  try {
    // Déterminer le statut initial de la session basé sur les dates fournies
    const initialStatut = getSessionStatus(dateDebut, dateFin);

    const newSession = new Session({
      title,
      formateur,
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      lieu,
      capaciteMax,
      description,
      participantsInscrits: participantsInscrits,
      statut: initialStatut, // Utilise le statut déterminé par la fonction
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Une session avec ce titre existe déjà (conflit)." });
    }
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la session." });
  }
};

// @desc    Mettre à jour une session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id); // Utilise 'let'

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    const {
      title,
      formateur,
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      lieu,
      capaciteMax,
      participantsInscrits,
      statut, // On l'accepte pour permettre de forcer "Annulée"
      description,
    } = req.body;

    // Validation côté contrôleur pour participantsInscrits vs capaciteMax
    if (
      participantsInscrits !== undefined &&
      participantsInscrits >
        (capaciteMax !== undefined ? capaciteMax : session.capaciteMax)
    ) {
      return res.status(400).json({
        message:
          "Le nombre de participants inscrits ne peut pas dépasser la capacité maximale.",
      });
    }

    // Mettre à jour les champs individuellement
    session.title = title !== undefined ? title : session.title;
    session.formateur = formateur !== undefined ? formateur : session.formateur;
    session.dateDebut = dateDebut !== undefined ? dateDebut : session.dateDebut;
    session.dateFin = dateFin !== undefined ? dateFin : session.dateFin;
    session.heureDebut =
      heureDebut !== undefined ? heureDebut : session.heureDebut;
    session.heureFin = heureFin !== undefined ? heureFin : session.heureFin;
    session.lieu = lieu !== undefined ? lieu : session.lieu;
    session.capaciteMax =
      capaciteMax !== undefined ? capaciteMax : session.capaciteMax;
    session.participantsInscrits =
      participantsInscrits !== undefined
        ? participantsInscrits
        : session.participantsInscrits;
    session.description =
      description !== undefined ? description : session.description;

    // Logique pour le statut:
    // Si le statut est explicitement envoyé comme "Annulée", on l'applique.
    // Sinon, on recalcule le statut basé sur les dates (celles mises à jour ou celles existantes).
    if (statut === "Annulée") {
      session.statut = "Annulée";
    } else {
      // Utilise les nouvelles dates si elles sont définies, sinon les dates existantes de la session
      const effectiveDateDebut =
        dateDebut !== undefined ? dateDebut : session.dateDebut;
      const effectiveDateFin =
        dateFin !== undefined ? dateFin : session.dateFin;
      session.statut = getSessionStatus(effectiveDateDebut, effectiveDateFin);
    }

    const updatedSession = await session.save(); // Applique les validations du schéma Mongoose
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la session:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de session invalide." });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      // Erreur de clé unique si le titre est modifié et existe déjà
      return res.status(409).json({
        message:
          "Une session avec ce titre existe déjà (conflit lors de la mise à jour).",
      });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de la session.",
    });
  }
};

// @desc    Supprimer une session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    await Session.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Session supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la session:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de session invalide." });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de la session.",
    });
  }
};

// @desc    Obtenir le nombre total de sessions
// @route   GET /api/sessions/count
// @access  Public
exports.countSessions = async (req, res) => {
  try {
    const count = await Session.countDocuments();
    res.status(200).json({ count: count });
  } catch (error) {
    console.error("Erreur lors du comptage des sessions:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors du comptage des sessions." });
  }
};
