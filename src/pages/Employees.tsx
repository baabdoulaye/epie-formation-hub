import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search } from "lucide-react";
import AddEmployeeForm from '@/components/forms/AddEmployeeForm';
import { useToast } from "@/hooks/use-toast";

/**
 * Page Employés - Gestion du personnel EPIE
 */
const Employees: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Données d'exemple pour les employés
  const employees = [
    {
      id: 1,
      civilite: 'Mme',
      nom: 'Dubois',
      prenom: 'Marie',
      poste: 'Directrice',
      service: 'Direction',
      email: 'marie.dubois@epie.fr',
      telephone: '01 23 45 67 89',
      statut: 'Actif'
    },
    {
      id: 2,
      civilite: 'M.',
      nom: 'Martin',
      prenom: 'Pierre',
      poste: 'Formateur',
      service: 'Pédagogie',
      email: 'pierre.martin@epie.fr',
      telephone: '01 23 45 67 90',
      statut: 'Actif'
    },
    {
      id: 3,
      civilite: 'Mme',
      nom: 'Leroy',
      prenom: 'Sophie',
      poste: 'Coordinatrice',
      service: 'Administration',
      email: 'sophie.leroy@epie.fr',
      telephone: '01 23 45 67 91',
      statut: 'Congé'
    }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      toast({
        title: "Recherche d'employés",
        description: `Recherche pour: "${value}"`,
      });
    }
  };

  const handleViewEmployee = (employee: any) => {
    toast({
      title: "Voir Employé",
      description: `Affichage du profil de ${employee.prenom} ${employee.nom}`,
    });
  };

  const handleEditEmployee = (employee: any) => {
    toast({
      title: "Modifier Employé",
      description: `Modification du profil de ${employee.prenom} ${employee.nom}`,
    });
  };

  if (showForm) {
    return (
      <Layout>
        <AddEmployeeForm onBack={() => setShowForm(false)} />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <span className="text-green-600 font-bold text-sm">A</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold">
                    {employees.filter(emp => emp.statut === 'Actif').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">C</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Congé</p>
                  <p className="text-2xl font-bold">
                    {employees.filter(emp => emp.statut === 'Congé').length}
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

        {/* Barre de recherche sans filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </CardContent>
        </Card>

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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
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
                        <Badge 
                          variant={employee.statut === 'Actif' ? 'default' : 'secondary'}
                        >
                          {employee.statut}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewEmployee(employee)}
                          >
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Modifier
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
