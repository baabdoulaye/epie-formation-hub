
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, User } from 'lucide-react';

/**
 * Page Students - Gestion des stagiaires
 * 
 * Interface pour visualiser, rechercher et gérer tous les stagiaires
 * inscrits dans les formations d'EPIE
 */
const Students: React.FC = () => {
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
          <Button className="bg-primary hover:bg-primary/90">
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
              Fonctionnalités à venir : liste complète, profils détaillés, historique des formations, etc.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Voir la Liste Complète
              </Button>
              <Button>
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
