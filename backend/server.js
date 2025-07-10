// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Charger les variables d'environnement depuis .env
dotenv.config({ path: "./.env" }); // S'assurer que le chemin est correct pour ton environnement

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté avec succès !");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err.message); // Affiche l'erreur complète pour le débogage
    console.error(err);
    process.exit(1);
  }
};
connectDB();

// Routes
const employeeRoutes = require("./routes/employeeRoutes");
const partnersRoutes = require("./routes/partners");
const formationRoutes = require("./routes/formationRoutes");
const stagiaireRoutes = require("./routes/stagiaireRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const stageRoutes = require("./routes/stageRoutes"); // <--- AJOUTE CETTE LIGNE

// Monte les routes
app.use("/api/employees", employeeRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/stagiaires", stagiaireRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/internships", stageRoutes); // <--- AJOUTE CETTE LIGNE POUR LES STAGES

app.get("/", (req, res) => {
  res.send("L'API est opérationnelle !!!");
});

// Gestionnaire d'erreurs global (AJOUTE CE BLOC POUR UNE MEILLEURE GESTION DES ERREURS)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log l'erreur complète pour le débogage
  res.status(err.statusCode || 500).json({
    // Utilise un statut d'erreur spécifique si défini, sinon 500
    message: err.message || "Une erreur inattendue est survenue!",
    ...(process.env.NODE_ENV === "development" && { error: err }), // N'affiche l'objet erreur qu'en dev
  });
});

// Démarrage du serveur
app.listen(PORT, () =>
  console.log(`Serveur backend démarré sur le port ${PORT}`)
);
