// frontend/src/pages/Employees.tsx
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import AddEmployeeForm from "@/components/forms/AddEmployeeForm";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

/**
 * Page Employés - Gestion du personnel EPIE
 */
const Employees: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  console.log("Valeur initiale de showForm:", showForm);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]); // Initialise à un tableau vide, les données viendront de l'API

  // URL de base de ton API backend
  const API_URL = "http://localhost:5000/api/employees"; // Adapte le port si différent (5000 est celui par défaut pour le backend Docker)

  console.log("Composant Employees monté ou rendu.");

  // 1. Fonction pour charger les employés depuis le backend au chargement de la page
  const fetchEmployees = async () => {
    console.log("Appel de fetchEmployees...");
    try {
      const response = await axios.get(API_URL);
      console.log("Données reçues du backend:", response.data);
      setEmployees(response.data); // Met à jour l'état avec les données de l'API
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les employés. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Utilise useEffect pour charger les employés une seule fois au montage du composant
  useEffect(() => {
    console.log("Utilisation de useEffect...");
    fetchEmployees();
  }, []); // Le tableau vide [] signifie que cela s'exécute une seule fois au chargement initial

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  // 2. Modifier la fonction de suppression pour appeler l'API
  const handleDeleteEmployee = async (employeeId: string) => {
    // L'ID vient de la BDD, souvent string (MongoDB utilise _id)
    try {
      // Pour afficher le nom dans le toast avant suppression
      const employeeToDelete = employees.find(
        (emp: any) => emp._id === employeeId
      ); // CORRECTION: emp.id -> emp._id

      // Appel à l'API pour supprimer
      await axios.delete(`${API_URL}/${employeeId}`); // CORRECTION: Utilisation des backticks et ${}

      // Mise à jour de l'état local après succès API
      setEmployees(employees.filter((emp: any) => emp._id !== employeeId)); // CORRECTION: emp.id -> emp._id
      toast({
        title: "Employé supprimé",
        description: `${employeeToDelete?.prenom} ${employeeToDelete?.nom} a été supprimé.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'employé. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // 3. Modifier la fonction de soumission pour appeler l'API (Ajout ou Modification)
  const handleSubmitEmployee = async (data: any) => {
    try {
      if (editingEmployee) {
        // Modification existante
        // CORRECTION: editingEmployee.id -> editingEmployee._id et utilisation des backticks
        const response = await axios.put(
          `${API_URL}/${editingEmployee._id}`,
          data
        );
        setEmployees(
          employees.map((emp: any) =>
            emp._id === editingEmployee._id // CORRECTION: emp.id -> emp._id
              ? response.data // Utilise les données renvoyées par le backend
              : emp
          )
        );
        toast({
          title: "Employé modifié",
          description: `${data.prenom} ${data.nom} a été mis à jour.`,
        });
      } else {
        // Ajout d'un nouvel employé
        const response = await axios.post(API_URL, data); // Appel à l'API pour ajouter
        setEmployees([...employees, response.data]); // Ajoute l'employé renvoyé par le backend
        toast({
          title: "Employé ajouté",
          description: `${data.prenom} ${data.nom} a été ajouté.`,
        });
      }

      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'employé:", error);
      toast({
        title: "Erreur d'enregistrement",
        description:
          "Impossible d'enregistrer l'employé. Vérifiez la console pour les détails.",
        variant: "destructive",
      });
    }
  };

  // Logique pour afficher le formulaire ou la liste
  if (showForm) {
    return (
      <Layout>
        <AddEmployeeForm
          onBack={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          initialData={editingEmployee}
          onSubmit={handleSubmitEmployee}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
            <p className="text-gray-600 mt-2">
              Gestion du personnel et des équipes EPIE
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Nouvel Employé
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Employés
                  </p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">F</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Formateurs
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      employees.filter((emp: any) =>
                        emp.poste.includes("Formateur")
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">S</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Services</p>
                  <p className="text-2xl font-bold">
                    {new Set(employees.map((emp: any) => emp.service)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des employés */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Poste
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Service
                    </th>
                    {/* Colonne Contact / Téléphone supprimée */}
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(
                    (
                      employee: any // Ajoute ': any' ou crée une interface pour Employee
                    ) => (
                      <tr
                        key={employee._id}
                        className="border-b hover:bg-gray-50"
                      >
                        {/* Utilise _id pour la clé car c'est l'ID de MongoDB */}
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {employee.civilite} {employee.prenom}{" "}
                              {employee.nom}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{employee.poste}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-600">{employee.service}</p>
                        </td>
                        {/* Cellule de données Téléphone supprimée, ne reste que l'email */}
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{employee.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEmployee(employee)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee._id)} // CORRECTION: Utilise employee._id
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Employees;
