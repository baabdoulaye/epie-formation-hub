// backend/routes/employeeRoutes.js

const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  countEmployees,
  getEmployeeCountsByRoleAndService, // <-- Ajoute cette ligne
} = require("../controllers/employeeController");

// Route pour obtenir tous les employés et ajouter un nouvel employé
router.route("/").get(getEmployees).post(addEmployee);

// Nouvelle route pour obtenir le nombre total d'employés
router.get("/count", countEmployees);

// Nouvelle route pour les statistiques par rôle et service
router.get("/stats/roles-services", getEmployeeCountsByRoleAndService); // <-- Ajoute cette nouvelle route

// Route pour obtenir, mettre à jour ou supprimer un employé par ID
router
  .route("/:id")
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
