
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AddInternshipForm from '@/components/internships/AddInternshipForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, Plus, ArrowLeft, Building, User, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Internships: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [partnerCompanies, setPartnerCompanies] = useState<string[]>([
    "Société Informatique du Nord",
    "Digital Solutions SARL",
    "TechnoServ Industries",
    "Groupe Commercial Lille"
  ]);
  const { toast } = useToast();

  const handleAddInternship = (data: any) => {
    console.log('Données du nouveau stage:', data);
    
    // Ajouter l'entreprise à la liste des partenaires si elle n'y est pas déjà
    if (data.entreprise && !partnerCompanies.includes(data.entreprise)) {
      setPartnerCompanies(prev => [...prev, data.entreprise]);
    }
    
    toast({
      title: "Stage ajouté avec succès",
      description: `Le stage de ${data.prenom} ${data.nom} chez ${data.entreprise} a été enregistré.`,
    });
    
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <Layout>
        <div className="space-y-6">
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
                Ajouter un Nouveau Stage
              </h1>
              <p className="text-gray-600 mt-1">
                Enregistrez toutes les informations du stage effectué par le stagiaire
              </p>
            </div>
          </div>

          <AddInternshipForm 
            onSubmit={handleAddInternship}
            onCancel={handleCancelAdd}
          />
        </div>
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
              Gestion des Stages
            </h1>
            <p className="text-gray-600 mt-1">
              156 stages enregistrés • 23 en cours
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Stage
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stages en cours</p>
                  <p className="text-xl font-semibold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Entreprises partenaires</p>
                  <p className="text-xl font-semibold">{partnerCompanies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stagiaires en stage</p>
                  <p className="text-xl font-semibold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Visites programmées</p>
                  <p className="text-xl font-semibold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Entreprises Partenaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <span>Entreprises Partenaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{company}</span>
                </div>
              ))}
            </div>
            {partnerCompanies.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucune entreprise partenaire pour le moment. 
                Ajoutez un stage pour voir les entreprises s'afficher ici.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom de stagiaire, entreprise ou tuteur..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les secteurs</option>
                  <option>Informatique</option>
                  <option>Commerce</option>
                  <option>Industrie</option>
                  <option>Services</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les types de visite</option>
                  <option>Présentiel</option>
                  <option>Téléphone</option>
                  <option>Visioconférence</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Toutes les conventions</option>
                  <option>Conventionné</option>
                  <option>Non conventionné</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suivi des stages */}
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Suivi des Stages
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Cette section affiche tous les stages effectués par vos stagiaires. 
              Consultez les informations complètes des stages, suivez les visites et maintenez 
              le contact avec les entreprises partenaires.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Stage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Internships;
