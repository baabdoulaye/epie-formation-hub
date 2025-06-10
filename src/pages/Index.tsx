
import React from 'react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Users, Calendar, User, File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Page Index - Tableau de bord principal d'EPIE Connect
 * 
 * Affiche les statistiques principales, graphiques et informations
 * de synthèse pour le pilotage des activités d'EPIE Formation
 */
const Index: React.FC = () => {
  // Données mockées pour les statistiques (à remplacer par de vraies données API)
  const statsData = {
    students: {
      total: 245,
      active: 198,
      trend: { value: 12, isPositive: true }
    },
    trainings: {
      total: 12,
      active: 8,
      trend: { value: 3, isPositive: true }
    },
    employees: {
      total: 18,
      trainers: 12,
      trend: { value: 2, isPositive: true }
    },
    partners: {
      total: 24,
      active: 20,
      trend: { value: 5, isPositive: true }
    }
  };

  // Données pour le graphique des formations par catégorie
  const trainingsByCategoryData = [
    { name: 'Numérique', value: 156, color: '#0077bc' },
    { name: 'Socles Compétences', value: 67, color: '#d3d92b' },
    { name: 'Linguistique', value: 22, color: '#339fce' }
  ];

  // Données pour le graphique des sessions mensuelles
  const monthlySessionsData = [
    { name: 'Jan', value: 8 },
    { name: 'Fév', value: 12 },
    { name: 'Mar', value: 10 },
    { name: 'Avr', value: 15 },
    { name: 'Mai', value: 18 },
    { name: 'Jun', value: 14 }
  ];

  // Sessions récentes (données mockées)
  const recentSessions = [
    {
      id: '1',
      title: 'TP - Technicien(ne) d\'Assistance Informatique',
      date: '2024-06-12',
      trainer: 'Pierre Martin',
      participants: 15,
      status: 'En cours'
    },
    {
      id: '2',
      title: 'Formation Cléa - Compétences de base',
      date: '2024-06-10',
      trainer: 'Sophie Dubois',
      participants: 12,
      status: 'Planifiée'
    },
    {
      id: '3',
      title: 'Français Langue Étrangère - Niveau A2',
      date: '2024-06-08',
      trainer: 'Marie Leroy',
      participants: 8,
      status: 'Terminée'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* En-tête de la page */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble des activités d'EPIE Formation
          </p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Stagiaires Actifs"
            value={statsData.students.active}
            subtitle={`${statsData.students.total} total`}
            icon={Users}
            trend={statsData.students.trend}
            color="blue"
          />
          
          <StatsCard
            title="Formations Actives"
            value={statsData.trainings.active}
            subtitle={`${statsData.trainings.total} total`}
            icon={File}
            trend={statsData.trainings.trend}
            color="green"
          />
          
          <StatsCard
            title="Formateurs"
            value={statsData.employees.trainers}
            subtitle={`${statsData.employees.total} employés total`}
            icon={User}
            trend={statsData.employees.trend}
            color="purple"
          />
          
          <StatsCard
            title="Partenaires Actifs"
            value={statsData.partners.active}
            subtitle={`${statsData.partners.total} total`}
            icon={Users}
            trend={statsData.partners.trend}
            color="orange"
          />
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Stagiaires par Catégorie de Formation"
            subtitle="Répartition des inscriptions actuelles"
            type="pie"
            data={trainingsByCategoryData}
            dataKey="value"
            nameKey="name"
          />
          
          <ChartCard
            title="Sessions de Formation par Mois"
            subtitle="Évolution sur les 6 derniers mois"
            type="bar"
            data={monthlySessionsData}
            dataKey="value"
            nameKey="name"
          />
        </div>

        {/* Informations récentes et actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions récentes */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sessions Récentes</CardTitle>
              <Button variant="outline" size="sm">
                Voir Toutes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {session.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>📅 {session.date}</span>
                        <span>👨‍🏫 {session.trainer}</span>
                        <span>👥 {session.participants} participants</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'En cours' 
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'Planifiée'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Ajouter un Stagiaire
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <File className="mr-2 h-4 w-4" />
                Créer une Formation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Planifier une Session
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Gérer les Utilisateurs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Message de bienvenue personnalisé */}
        <Card className="epie-gradient-subtle border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full epie-gradient flex items-center justify-center">
                <span className="text-white font-bold">🏫</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bienvenue sur EPIE Connect !
                </h3>
                <p className="text-gray-600">
                  Votre intranet de gestion pour piloter efficacement les activités d'EPIE Formation. 
                  Accédez rapidement aux données importantes, gérez vos stagiaires et formations, 
                  et suivez les performances en temps réel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
