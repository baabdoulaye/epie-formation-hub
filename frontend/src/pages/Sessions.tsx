
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AddSessionForm from '@/components/sessions/AddSessionForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Plus, ArrowLeft, Clock, Users, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  title: string;
  formation: string;
  formateur: string;
  dateDebut: string;
  dateFin: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  capaciteMax: number;
  participantsInscrits: number;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  description?: string;
}

const Sessions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Données mockées des sessions
  const mockSessions: Session[] = [
    {
      id: '1',
      title: 'TP - Technicien(ne) d\'Assistance Informatique',
      formation: 'technicien-assistance-informatique',
      formateur: 'Pierre Martin',
      dateDebut: '2024-06-12',
      dateFin: '2024-08-15',
      heureDebut: '09:00',
      heureFin: '17:00',
      lieu: 'Salle de formation A',
      capaciteMax: 15,
      participantsInscrits: 12,
      statut: 'En cours',
      description: 'Formation complète aux métiers de l\'assistance informatique'
    },
    {
      id: '2',
      title: 'Formation Cléa - Compétences de base',
      formation: 'clea-competences-base',
      formateur: 'Sophie Dubois',
      dateDebut: '2024-06-20',
      dateFin: '2024-07-18',
      heureDebut: '14:00',
      heureFin: '17:00',
      lieu: 'Salle polyvalente B',
      capaciteMax: 12,
      participantsInscrits: 8,
      statut: 'Planifiée',
      description: 'Acquisition des compétences de base professionnelles'
    },
    {
      id: '3',
      title: 'Français Langue Étrangère - Niveau A2',
      formation: 'francais-langue-etrangere',
      formateur: 'Marie Leroy',
      dateDebut: '2024-05-15',
      dateFin: '2024-06-10',
      heureDebut: '09:30',
      heureFin: '12:30',
      lieu: 'Salle de cours C',
      capaciteMax: 10,
      participantsInscrits: 10,
      statut: 'Terminée',
      description: 'Apprentissage du français pour non-francophones'
    }
  ];

  const filteredSessions = mockSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.formateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSession = (data: any) => {
    console.log('Nouvelle session:', data);
    
    toast({
      title: "Session planifiée avec succès",
      description: `La session "${data.title}" a été créée et ajoutée au planning.`,
    });
    
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En cours':
        return 'bg-green-100 text-green-700';
      case 'Planifiée':
        return 'bg-blue-100 text-blue-700';
      case 'Terminée':
        return 'bg-gray-100 text-gray-700';
      case 'Annulée':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
              <span>Retour aux sessions</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Planifier une Nouvelle Session
              </h1>
              <p className="text-gray-600 mt-1">
                Créez une nouvelle session de formation
              </p>
            </div>
          </div>

          <AddSessionForm 
            onSubmit={handleAddSession}
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
              Sessions de Formation
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredSessions.length} sessions • {filteredSessions.filter(s => s.statut === 'En cours').length} en cours
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Planifier une Session
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par titre, formateur ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Formateur: {session.formateur}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Du {new Date(session.dateDebut).toLocaleDateString('fr-FR')} au {new Date(session.dateFin).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{session.heureDebut} - {session.heureFin}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{session.lieu}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{session.participantsInscrits}/{session.capaciteMax} participants</span>
                      </div>
                    </div>

                    {session.description && (
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                        {session.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.statut)}`}>
                      {session.statut}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Aucune session ne correspond à votre recherche.' : 'Commencez par planifier votre première session.'}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Planifier une Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Sessions;
