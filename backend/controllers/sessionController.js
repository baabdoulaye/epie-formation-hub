// backend/controllers/sessionController.js
const Session = require("../models/Session"); // Assure-toi que ce modèle existe

// @desc    Obtenir toutes les sessions
// @route   GET /api/sessions
// @access  Public
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({}); // On peut ajouter des filtres ici plus tard si besoin
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error);
    // Utilise un message plus générique pour éviter de révéler des détails d'implémentation
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des sessions.",
    });
  }
};

// @desc    Obtenir une seule session par ID
// @route   GET /api/sessions/:id
// @access  Public
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la session par ID:",
      error
    );
    // Gérer spécifiquement l'erreur si l'ID n'est pas un format valide de MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de session invalide." });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la session.",
    });
  }
};

// @desc    Créer une nouvelle session
// @route   POST /api/sessions
// @access  Private (typiquement, la création serait restreinte)
exports.createSession = async (req, res) => {
  // Il est préférable de déstructurer les champs attendus pour plus de clarté
  const {
    title,
    formation,
    formateur,
    dateDebut,
    dateFin,
    heureDebut,
    heureFin,
    lieu,
    capaciteMax,
    description,
    participantsInscrits, // <--- NOUVEAU: S'assurer que 'participantsInscrits' est déstructuré
    statut, // Peut être fourni, sinon le modèle mettra sa valeur par défaut
  } = req.body;

  // Validation basique côté contrôleur
  // Pas besoin de valider participantsInscrits ici si Mongoose Schema le gère avec un 'default' et 'min'
  if (
    !title ||
    !formation ||
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
        "Veuillez fournir tous les champs obligatoires : titre, formation, formateur, dates, heures, lieu, capacité maximale.",
    });
  }

  // Optionnel : Validation spécifique si participantsInscrits doit être <= capaciteMax ici aussi.
  // Cependant, la validation Mongoose au niveau du schéma est plus robuste et gère cela.
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
    // Optionnel : Vérifier si une session avec le même titre existe déjà avant de tenter de sauvegarder
    // C'est redondant si tu as 'unique: true' sur le titre dans le schéma, mais utile pour un message d'erreur plus clair.
    // const existingSession = await Session.findOne({ title: title });
    // if (existingSession) {
    //   return res
    //     .status(409)
    //     .json({ message: "Une session avec ce titre existe déjà." });
    // }

    const newSession = new Session({
      title,
      formation,
      formateur,
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      lieu,
      capaciteMax,
      description,
      // MISE À JOUR : Assure-toi que participantsInscrits est passé ou utilise la valeur par défaut du schéma.
      // Le 'default: 0' dans le schéma Mongoose est la meilleure approche. Si tu l'envoies depuis le frontend, il sera utilisé.
      participantsInscrits: participantsInscrits,
      statut: statut || "Planifiée", // Le modèle peut aussi avoir un statut par défaut
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession); // 201 Created est le bon code pour une création réussie
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    // Gérer spécifiquement les erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    // Gérer les erreurs de clé unique (comme le titre) si Mongoose les renvoie
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

// @desc    Mettre à jour une session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // MISE À JOUR : Déstructure les champs du corps de la requête pour une mise à jour plus explicite
    // Plutôt que Object.assign(session, req.body), ce qui peut introduire des champs non désirés
    const {
      title,
      formation,
      formateur,
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      lieu,
      capaciteMax,
      participantsInscrits, // <--- NOUVEAU: S'assurer que 'participantsInscrits' est déstructuré pour la mise à jour
      description,
      statut, // Si tu permets la mise à jour du statut
    } = req.body;

    // Validation côté contrôleur pour participantsInscrits vs capaciteMax pour la mise à jour
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
    session.formation = formation !== undefined ? formation : session.formation;
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
        : session.participantsInscrits; // <--- NOUVEAU: Mise à jour du champ
    session.description =
      description !== undefined ? description : session.description;
    session.statut = statut !== undefined ? statut : session.statut;

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

// @desc    Supprimer une session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    // Utilise deleteOne après avoir trouvé pour gérer la 404 clairement
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    await Session.deleteOne({ _id: req.params.id }); // Mongoose 6+
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

// @desc    Obtenir le nombre total de sessions
// @route   GET /api/sessions/count
// @access  Public
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
