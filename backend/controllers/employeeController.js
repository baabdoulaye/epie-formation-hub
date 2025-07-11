// backend/controllers/employeeController.js
const Employee = require("../models/Employee");

// @desc    Obtenir tous les employés
// @route   GET /api/employees
// @access  Public (ou Private si authentification est mise en place)
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un seul employé par ID
// @route   GET /api/employees/:id
// @access  Public
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employé non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ajouter un nouvel employé
// @route   POST /api/employees
// @access  Private (si authentification)
const addEmployee = async (req, res) => {
  const { civilite, nom, prenom, poste, service, email, telephone } = req.body;

  // Validation basique des champs requis (plus détaillé dans le modèle Mongoose)
  if (!civilite || !nom || !prenom || !poste || !service || !email) {
    return res.status(400).json({
      message:
        "Veuillez remplir tous les champs obligatoires (Civilité, Nom, Prénom, Poste, Service, Email).",
    });
  }

  try {
    // Vérifier si un employé avec cet email existe déjà
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Un employé avec cet email existe déjà." });
    }

    const newEmployee = new Employee({
      civilite,
      nom,
      prenom,
      poste,
      service,
      email,
      telephone,
    });

    const createdEmployee = await newEmployee.save();
    res.status(201).json(createdEmployee); // 201 Created
  } catch (error) {
    // Gérer les erreurs de validation Mongoose ou autres erreurs serveur
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un employé
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      // Mettre à jour les champs si présents dans la requête
      employee.civilite = req.body.civilite || employee.civilite;
      employee.nom = req.body.nom || employee.nom;
      employee.prenom = req.body.prenom || employee.prenom;
      employee.poste = req.body.poste || employee.poste;
      employee.service = req.body.service || employee.service;
      employee.email = req.body.email || employee.email;
      employee.telephone = req.body.telephone || employee.telephone;

      const updatedEmployee = await employee.save();
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Employé non trouvé" });
    }
  } catch (error) {
    // Gérer les erreurs de validation Mongoose ou autres erreurs serveur
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un employé
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await Employee.deleteOne({ _id: req.params.id }); // Mongoose 6+
      res.status(200).json({ message: "Employé supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Employé non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le nombre total d'employés
// @route   GET /api/employees/count
// @access  Public
const countEmployees = async (req, res) => {
  try {
    const count = await Employee.countDocuments(); // Utilise la méthode countDocuments() de Mongoose
    res.status(200).json({ count: count });
  } catch (error) {
    console.error("Erreur lors du comptage des employés:", error); // Ajout d'un log pour le débogage
    res
      .status(500)
      .json({ message: "Erreur serveur lors du comptage des employés." });
  }
};
const getEmployeeCountsByRoleAndService = async (req, res) => {
  try {
    const employeeStats = await Employee.aggregate([
      {
        $group: {
          _id: { service: "$service", poste: "$poste" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclut l'ID par défaut
          service: "$_id.service",
          poste: "$_id.poste",
          count: 1,
        },
      },
      {
        $sort: { service: 1, poste: 1 }, // Optionnel: trie les résultats
      },
    ]);
    res.status(200).json(employeeStats);
  } catch (error) {
    console.error(
      "Erreur lors de l'obtention des stats employés par rôle/service:",
      error
    );
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  countEmployees, // <-- Très important : exporter la nouvelle fonction
  getEmployeeCountsByRoleAndService, // <-- N'oublie pas d'exporter cette nouvelle fonction
};
