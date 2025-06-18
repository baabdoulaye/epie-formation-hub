
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Search, Calendar } from 'lucide-react';
import AddTrainingForm from '@/components/forms/AddTrainingForm';
import { useToast } from "@/hooks/use-toast";

/**
 * Page Trainings - Gestion des formations
 * 
 * Interface pour visualiser, créer et gérer toutes les formations
 * proposées par EPIE Formation
 */
const Trainings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      toast({
        title: "Recherche de formations",
        description: `Recherche pour: "${value}"`,
      });
    }
  };

  const handleScheduleSession = () => {
    toast({
      title: "Planifier une Session",
      description: "Fonctionnalité en cours de développement",
    });
  };

  if (showForm) {
    return (
      <Layout>
        <AddTrainingForm onBack={() => setShowForm(false)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Formations
            </h1>
            <p className="text-gray-600 mt-1">
              12 formations disponibles • 8 sessions actives
            </p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => setShowForm(true)}
          >
            <File className="mr-2 h-4 w-4" />
            Créer une Formation
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formations Numériques</p>
                  <p className="text-xl font-semibold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Socles de Compétences</p>
                  <p className="text-xl font-semibold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formations Linguistiques</p>
                  <p className="text-xl font-semibold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Toutes les catégories</option>
                  <option>Formations Numériques</option>
                  <option>Socles de Compétences</option>
                  <option>Formations Linguistiques</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les statuts</option>
                  <option>Active</option>
                  <option>Planifiée</option>
                  <option>Terminée</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message temporaire pour la construction */}
        <Card className="text-center py-12">
          <CardContent>
            <File className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Catalogue des Formations EPIE
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Gérez ici toutes les formations proposées par EPIE Formation. 
              Créez de nouvelles formations, planifiez des sessions et suivez les inscriptions.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleScheduleSession}>
                <Calendar className="mr-2 h-4 w-4" />
                Planifier une Session
              </Button>
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => setShowForm(true)}
              >
                <File className="mr-2 h-4 w-4" />
                Nouvelle Formation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Trainings;
