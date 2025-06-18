
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Page Sessions - Affichage des sessions de formation
 */
const Sessions: React.FC = () => {
  const navigate = useNavigate();

  // Sessions mockées
  const sessions = [
    {
      id: '1',
      title: 'TP - Technicien(ne) d\'Assistance Informatique',
      date: '2024-06-12',
      trainer: 'Pierre Martin',
      participants: 15,
      status: 'En cours',
      duration: '35h',
      location: 'Salle A1'
    },
    {
      id: '2',
      title: 'Formation Cléa - Compétences de base',
      date: '2024-06-10',
      trainer: 'Sophie Dubois',
      participants: 12,
      status: 'Planifiée',
      duration: '21h',
      location: 'Salle B2'
    },
    {
      id: '3',
      title: 'Français Langue Étrangère - Niveau A2',
      date: '2024-06-08',
      trainer: 'Marie Leroy',
      participants: 8,
      status: 'Terminée',
      duration: '40h',
      location: 'Salle C1'
    },
    {
      id: '4',
      title: 'Bureautique - Pack Office',
      date: '2024-06-15',
      trainer: 'Jean Dupont',
      participants: 10,
      status: 'Planifiée',
      duration: '28h',
      location: 'Salle Info'
    },
    {
      id: '5',
      title: 'Remise à Niveau Mathématiques',
      date: '2024-06-05',
      trainer: 'Claire Martin',
      participants: 6,
      status: 'Terminée',
      duration: '30h',
      location: 'Salle D3'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-700';
      case 'Planifiée':
        return 'bg-blue-100 text-blue-700';
      case 'Terminée':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au tableau de bord</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sessions de Formation
            </h1>
            <p className="text-gray-600 mt-1">
              {sessions.length} sessions au total
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessions en cours</p>
                  <p className="text-xl font-semibold">
                    {sessions.filter(s => s.status === 'En cours').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessions planifiées</p>
                  <p className="text-xl font-semibold">
                    {sessions.filter(s => s.status === 'Planifiée').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total participants</p>
                  <p className="text-xl font-semibold">
                    {sessions.reduce((total, session) => total + session.participants, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {session.title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <span>📅 {session.date}</span>
                      <span>👨‍🏫 {session.trainer}</span>
                      <span>👥 {session.participants} participants</span>
                      <span>⏱️ {session.duration}</span>
                      <span>📍 {session.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sessions;
