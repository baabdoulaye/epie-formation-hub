
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AddStudentForm from '@/components/students/AddStudentForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, User, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

/**
 * Page Students - Gestion des stagiaires
 * 
 * Interface pour visualiser, rechercher et gérer tous les stagiaires
 * inscrits dans les formations d'EPIE
 */
const Students: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  /**
   * Gère la soumission du formulaire d'ajout de stagiaire
   * @param data - Données du formulaire validées
   */
  const handleAddStudent = (data: any) => {
    console.log('Données du nouveau stagiaire:', data);
    
    // Ici, vous intégreriez l'appel API pour sauvegarder le stagiaire
    // Exemple : await api.students.create(data);
    
    toast({
      title: "Stagiaire ajouté avec succès",
      description: `${data.firstName} ${data.lastName} a été ajouté à la base de données.`,
    });
    
    // Retour à la liste des stagiaires
    setShowAddForm(false);
  };

  /**
   * Gère l'annulation de l'ajout de stagiaire
   */
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  // Affichage du formulaire d'ajout
  if (showAddForm) {
    return (
      <Layout>
        <div className="space-y-6">
          {/* En-tête avec bouton retour */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleCancelAdd}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un Nouveau Stagiaire
              </h1>
              <p className="text-gray-600 mt-1">
                Remplissez tous les champs requis pour créer le profil complet du stagiaire
              </p>
            </div>
          </div>

          {/* Formulaire d'ajout */}
          <AddStudentForm 
            onSubmit={handleAddStudent}
            onCancel={handleCancelAdd}
          />
        </div>
      </Layout>
    );
  }

  // Affichage de la liste des stagiaires
  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Stagiaires
            </h1>
            <p className="text-gray-600 mt-1">
              245 stagiaires inscrits • 198 actifs
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <User className="mr-2 h-4 w-4" />
            Ajouter un Stagiaire
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou formation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Toutes les formations</option>
                  <option>Formations Numériques</option>
                  <option>Socles de Compétences</option>
                  <option>Formations Linguistiques</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les statuts</option>
                  <option>Actif</option>
                  <option>Diplômé</option>
                  <option>Abandonné</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message temporaire pour la construction */}
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Interface de Gestion des Stagiaires
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Cette section permettra de gérer tous les stagiaires inscrits chez EPIE Formation. 
              Le formulaire d'ajout complet est maintenant disponible avec tous les champs requis.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Voir la Liste Complète
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                Ajouter un Stagiaire
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;
