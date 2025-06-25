// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Pour permettre à ton frontend de communiquer avec le backend

// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Le port de ton backend

// Middlewares
app.use(express.json()); // Pour parser le JSON des requêtes (req.body)
app.use(cors()); // Active CORS pour les requêtes du frontend

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté avec succès !");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1); // Arrête le processus en cas d'erreur
  }
};
connectDB();

// Routes (elles seront définies dans le dossier routes)
const employeeRoutes = require("./routes/employeeRoutes");

// Exemple : app.use('/api/employees', require('./routes/employeeRoutes'));*
app.use("/api/employees", employeeRoutes);

// Tu ajouteras tes routes ici au fur et à mesure

app.get("/", (req, res) => {
  res.send("L'API est opérationnelle !!!");
});

// Démarrage du serveur
app.listen(PORT, () =>
  console.log(`Serveur backend démarré sur le port ${PORT}`)
);
