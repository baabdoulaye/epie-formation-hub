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
    // IMPORTANT : Assure-toi que MONGO_URI dans ton .env (dans le dossier backend)
    // ou la configuration de ton docker-compose.yml est :
    // MONGO_URI=mongodb://epie-mongodb:27017/epie_formation_db
    // (si ton service MongoDB dans Docker Compose s'appelle 'epie-mongodb')
    // OU MONGO_URI=mongodb://localhost:27017/epie_formation_db
    // (si MongoDB est sur ta machine locale sans Docker)
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
const partnersRoutes = require("./routes/partners"); // Ligne ajoutée : importe les routes des partenaires

// Monte les routes
app.use("/api/employees", employeeRoutes);
app.use("/api/partners", partnersRoutes); // Ligne ajoutée : monte les routes des partenaires

app.get("/", (req, res) => {
  res.send("L'API est opérationnelle !!!");
});

// Démarrage du serveur
app.listen(PORT, () =>
  console.log(`Serveur backend démarré sur le port ${PORT}`)
);
