
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import AddEmployeeForm from '@/components/forms/AddEmployeeForm';
import { useToast } from "@/hooks/use-toast";

/**
 * Page Employés - Gestion du personnel EPIE
 */
const Employees: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();

  // Données d'exemple pour les employés
  const [employees, setEmployees] = useState([
    {
      id: 1,
      civilite: 'Mme',
      nom: 'Dubois',
      prenom: 'Marie',
      poste: 'Directrice',
      service: 'Direction',
      email: 'marie.dubois@epie.fr',
      telephone: '01 23 45 67 89'
    },
    {
      id: 2,
      civilite: 'M.',
      nom: 'Martin',
      prenom: 'Pierre',
      poste: 'Formateur',
      service: 'Pédagogie',
      email: 'pierre.martin@epie.fr',
      telephone: '01 23 45 67 90'
    },
    {
      id: 3,
      civilite: 'Mme',
      nom: 'Leroy',
      prenom: 'Sophie',
      poste: 'Coordinatrice',
      service: 'Administration',
      email: 'sophie.leroy@epie.fr',
      telephone: '01 23 45 67 91'
    }
  ]);

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    const employeeToDelete = employees.find(emp => emp.id === employeeId);
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    
    toast({
      title: "Employé supprimé",
      description: `${employeeToDelete?.prenom} ${employeeToDelete?.nom} a été supprimé.`,
    });
  };

  const handleSubmitEmployee = (data: any) => {
    if (editingEmployee) {
      // Modification
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...data }
          : emp
      ));
      toast({
        title: "Employé modifié",
        description: `${data.prenom} ${data.nom} a été mis à jour.`,
      });
    } else {
      // Ajout
      const newEmployee = {
        id: Date.now(),
        ...data
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Employé ajouté",
        description: `${data.prenom} ${data.nom} a été ajouté.`,
      });
    }
    
    setShowForm(false);
    setEditingEmployee(null);
  };

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
          <Button className="flex items-center gap-2" onClick={() => setShowForm(true)}>
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
                  <p className="text-sm font-medium text-gray-600">Total Employés</p>
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
                  <p className="text-sm font-medium text-gray-600">Formateurs</p>
                  <p className="text-2xl font-bold">
                    {employees.filter(emp => emp.poste.includes('Formateur')).length}
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
                  <p className="text-2xl font-bold">3</p>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nom</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Poste</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.civilite} {employee.prenom} {employee.nom}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{employee.poste}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600">{employee.service}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{employee.email}</p>
                          <p className="text-gray-600">{employee.telephone}</p>
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
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
