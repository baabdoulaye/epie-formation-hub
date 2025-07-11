// backend/controllers/sessionController.js
const Session = require("../models/Session");

// Fonction utilitaire pour déterminer le statut d'une session
const getSessionStatus = (dateDebut, dateFin) => {
  const now = new Date();
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

  // Vérifie si la session est annulée (prioritaire)
  // Note: le statut 'Annulée' devrait idéalement être géré comme un champ à part
  // et non uniquement par les dates, car une session annulée n'est pas forcément passée.
  // Pour l'instant, on se base sur la logique existante.
  // Si le statut est directement stocké dans la session, il faudrait le lire ici.

  if (sessionFinDay < today) {
    return "Terminée";
  } else if (sessionDebutDay <= today && sessionFinDay >= today) {
    return "En cours";
  } else {
    return "Planifiée";
  }
};

// @desc    Obtenir toutes les sessions
// @route   GET /api/sessions
// @access  Public
exports.getAllSessions = async (req, res) => {
  try {
    let sessions = await Session.find({});

    // Mettre à jour le statut de chaque session avant de l'envoyer au client
    sessions = sessions.map((session) => {
      // Convertir le document Mongoose en un objet JavaScript simple pour modification
      const sessionObj = session.toObject();
      // Si la session a un statut "Annulée" explicitement défini, le conserver
      if (sessionObj.statut === "Annulée") {
        return sessionObj;
      }
      // Sinon, calculer le statut basé sur les dates
      sessionObj.statut = getSessionStatus(
        sessionObj.dateDebut,
        sessionObj.dateFin
      );
      return sessionObj;
    });

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
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Mettre à jour le statut de la session avant de l'envoyer au client
    const sessionObj = session.toObject();
    if (sessionObj.statut !== "Annulée") {
      // Ne pas modifier si déjà annulée
      sessionObj.statut = getSessionStatus(
        sessionObj.dateDebut,
        sessionObj.dateFin
      );
    }

    res.status(200).json(sessionObj); // Renvoyer l'objet modifié
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

// @desc    Get recent sessions for dashboard
// @route   GET /api/sessions/recent
// @access  Public
exports.getRecentSessions = async (req, res) => {
  try {
    // On veut les sessions "En cours" ou "Planifiée" dont la date de fin est aujourd'hui ou après
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    let recentSessions = await Session.find({
      statut: { $ne: "Terminée" }, // Exclure celles explicitement "Terminée" si un statut est enregistré
      dateFin: { $gte: todayStart }, // La date de fin doit être aujourd'hui ou plus tard
    })
      .sort({ dateDebut: 1 })
      .limit(3);

    // Mettre à jour le statut de chaque session avant de l'envoyer au client
    recentSessions = recentSessions.map((session) => {
      const sessionObj = session.toObject();
      if (sessionObj.statut === "Annulée") {
        return sessionObj;
      }
      sessionObj.statut = getSessionStatus(
        sessionObj.dateDebut,
        sessionObj.dateFin
      );
      return sessionObj;
    });

    res.status(200).json(recentSessions);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sessions récentes:",
      error
    );
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly session counts for dashboard chart
// @route   GET /api/sessions/monthly-counts
// @access  Public
exports.getMonthlySessionCounts = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyCounts = await Session.aggregate([
      {
        $match: {
          dateDebut: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateDebut" },
            month: { $month: "$dateDebut" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Fév" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Avr" },
                { case: { $eq: ["$_id.month", 5] }, then: "Mai" },
                { case: { $eq: ["$_id.month", 6] }, then: "Juin" },
                { case: { $eq: ["$_id.month", 7] }, then: "Juil" },
                { case: { $eq: ["$_id.month", 8] }, then: "Août" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Déc" },
              ],
              default: "Inconnu",
            },
          },
          value: "$count",
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const result = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - (5 - i));
      const month = d.getMonth();
      const year = d.getFullYear();
      const monthName = monthNames[month];

      const existingData = monthlyCounts.find(
        (item) =>
          item.name === monthName &&
          new Date(new Date().setMonth(d.getMonth())).getFullYear() === year
      );

      if (existingData) {
        result.push(existingData);
      } else {
        result.push({ name: monthName, value: 0 });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors du comptage des sessions par mois:", error);
    res.status(500).json({
      message: "Erreur serveur lors du comptage des sessions par mois.",
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
  } = req.body;

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
    // Calculer le statut initial lors de la création
    const initialStatut = getSessionStatus(dateDebut, dateFin);

    const newSession = new Session({
      title,
      formateur,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      heureDebut,
      heureFin,
      lieu,
      capaciteMax,
      description,
      participantsInscrits: participantsInscrits || 0,
      statut: initialStatut, // Assigner le statut calculé
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
  const { id } = req.params;
  const updates = req.body;

  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    const effectiveCapaciteMax =
      updates.capaciteMax !== undefined
        ? updates.capaciteMax
        : session.capaciteMax;
    const effectiveParticipantsInscrits =
      updates.participantsInscrits !== undefined
        ? updates.participantsInscrits
        : session.participantsInscrits;

    if (effectiveParticipantsInscrits > effectiveCapaciteMax) {
      return res.status(400).json({
        message:
          "Le nombre de participants inscrits ne peut pas dépasser la capacité maximale.",
      });
    }

    if (updates.statut === "Annulée") {
      session.statut = "Annulée";
    }

    if (updates.dateDebut) updates.dateDebut = new Date(updates.dateDebut);
    if (updates.dateFin) updates.dateFin = new Date(updates.dateFin);

    // Si les dates sont modifiées, recalculer le statut si ce n'est pas "Annulée"
    const newDateDebut = updates.dateDebut || session.dateDebut;
    const newDateFin = updates.dateFin || session.dateFin;
    if (
      session.statut !== "Annulée" &&
      (updates.dateDebut || updates.dateFin)
    ) {
      updates.statut = getSessionStatus(newDateDebut, newDateFin);
    }
    // Assigner le nouveau statut calculé ou l'ancien si non modifié
    // Le statut 'Annulée' a priorité.

    Object.assign(session, updates);

    const updatedSession = await session.save();
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
