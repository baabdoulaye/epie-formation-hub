// frontend/src/pages/Index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { Users, Calendar, User, File, BookOpen, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * Page Index - Tableau de bord principal d'EPIE Connect
 *
 * Affiche les statistiques principales, graphiques et informations
 * de synthèse pour le pilotage des activités d'EPIE Formation
 */
const Index: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ÉTATS pour les données dynamiques
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [stagiaireCount, setStagiaireCount] = useState<number>(0); // Nouveau pour stagiaires
  const [formationCount, setFormationCount] = useState<number>(0); // Nouveau pour formations
  const [partnerCount, setPartnerCount] = useState<number>(0); // Nouveau pour partenaires

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);

  const [loadingStagiaires, setLoadingStagiaires] = useState(true); // Nouveau
  const [errorStagiaires, setErrorStagiaires] = useState<string | null>(null); // Nouveau

  const [loadingFormations, setLoadingFormations] = useState(true); // Nouveau
  const [errorFormations, setErrorFormations] = useState<string | null>(null); // Nouveau

  const [loadingPartners, setLoadingPartners] = useState(true); // Nouveau
  const [errorPartners, setErrorPartners] = useState<string | null>(null); // Nouveau

  // Suppression du statsData statique, les valeurs viendront des états
  // const statsData = { /* ... */ };

  // Données pour le graphique des formations par catégorie (restent mockées pour l'instant)
  const trainingsByCategoryData = [
    { name: "Numérique", value: 156, color: "#0077bc" },
    { name: "Socles Compétences", value: 67, color: "#d3d92b" },
    { name: "Linguistique", value: 22, color: "#339fce" },
  ];

  // Données pour le graphique des sessions mensuelles (restent mockées pour l'instant)
  const monthlySessionsData = [
    { name: "Jan", value: 8 },
    { name: "Fév", value: 12 },
    { name: "Mar", value: 10 },
    { name: "Avr", value: 15 },
    { name: "Mai", value: 18 },
    { name: "Jun", value: 14 },
  ];

  // Sessions récentes (données mockées)
  const recentSessions = [
    {
      id: "1",
      title: "TP - Technicien(ne) d'Assistance Informatique",
      date: "2024-06-12",
      trainer: "Pierre Martin",
      participants: 15,
      status: "En cours",
    },
    {
      id: "2",
      title: "Formation Cléa - Compétences de base",
      date: "2024-06-10",
      trainer: "Sophie Dubois",
      participants: 12,
      status: "Planifiée",
    },
    {
      id: "3",
      title: "Français Langue Étrangère - Niveau A2",
      date: "2024-06-08",
      trainer: "Marie Leroy",
      participants: 8,
      status: "Terminée",
    },
  ];

  // Fonctions pour récupérer les comptes depuis le backend
  const fetchEmployeeCount = async () => {
    setLoadingEmployees(true);
    setErrorEmployees(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employees/count`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEmployeeCount(data.count);
    } catch (error: any) {
      setErrorEmployees(error.message);
      console.error(
        "Erreur lors de la récupération du nombre d'employés:",
        error
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchStagiaireCount = async () => {
    setLoadingStagiaires(true);
    setErrorStagiaires(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stagiaires/count`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setStagiaireCount(data.count);
    } catch (error: any) {
      setErrorStagiaires(error.message);
      console.error(
        "Erreur lors de la récupération du nombre de stagiaires:",
        error
      );
    } finally {
      setLoadingStagiaires(false);
    }
  };

  const fetchFormationCount = async () => {
    setLoadingFormations(true);
    setErrorFormations(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/formations/count`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setFormationCount(data.count);
    } catch (error: any) {
      setErrorFormations(error.message);
      console.error(
        "Erreur lors de la récupération du nombre de formations:",
        error
      );
    } finally {
      setLoadingFormations(false);
    }
  };

  const fetchPartnerCount = async () => {
    setLoadingPartners(true);
    setErrorPartners(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/partners/count`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setPartnerCount(data.count);
    } catch (error: any) {
      setErrorPartners(error.message);
      console.error(
        "Erreur lors de la récupération du nombre de partenaires:",
        error
      );
    } finally {
      setLoadingPartners(false);
    }
  };

  // Appel des fonctions de fetch au montage du composant
  useEffect(() => {
    fetchEmployeeCount();
    fetchStagiaireCount(); // Appel pour les stagiaires
    fetchFormationCount(); // Appel pour les formations
    fetchPartnerCount(); // Appel pour les partenaires
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-student":
        navigate("/stagiaires");
        break;
      case "create-training":
        navigate("/formations");
        break;
      case "schedule-session":
        navigate("/sessions");
        break;
      case "manage-users":
        navigate("/employes");
        break;
      default:
        break;
    }
  };

  const handleViewAllSessions = () => {
    navigate("/sessions");
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* En-tête de la page */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">
            Vue d'ensemble des activités d'EPIE Formation
          </p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Stagiaires"
            value={
              loadingStagiaires
                ? "..."
                : errorStagiaires
                ? "Erreur"
                : stagiaireCount.toString()
            }
            subtitle="Total"
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Formations"
            value={
              loadingFormations
                ? "..."
                : errorFormations
                ? "Erreur"
                : formationCount.toString()
            }
            subtitle="Total"
            icon={BookOpen}
            color="green"
          />
          <StatsCard
            title="Employés"
            value={
              loadingEmployees
                ? "..."
                : errorEmployees
                ? "Erreur"
                : employeeCount.toString()
            }
            subtitle="Équipe pédagogique"
            icon={User}
            color="purple"
          />
          <StatsCard
            title="Partenaires"
            value={
              loadingPartners
                ? "..."
                : errorPartners
                ? "Erreur"
                : partnerCount.toString()
            }
            subtitle="Réseau de partenaires"
            icon={Building}
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAllSessions}
              >
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === "En cours"
                            ? "bg-green-100 text-green-700"
                            : session.status === "Planifiée"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
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
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("add-student")}
              >
                <Users className="mr-2 h-4 w-4" />
                Ajouter un Stagiaire
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("create-training")}
              >
                <File className="mr-2 h-4 w-4" />
                Créer une Formation
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("schedule-session")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Planifier une Session
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("manage-users")}
              >
                <User className="mr-2 h-4 w-4" />
                Gérer les Employés
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
