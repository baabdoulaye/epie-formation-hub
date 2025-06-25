// backend/routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Route pour obtenir tous les employés et ajouter un nouvel employé
// GET /api/employees
// POST /api/employees
router.route("/").get(getEmployees).post(addEmployee);

// Route pour obtenir, mettre à jour ou supprimer un employé par ID
// GET /api/employees/:id
// PUT /api/employees/:id
// DELETE /api/employees/:id
router
  .route("/:id")
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
