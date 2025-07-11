// frontend/src/pages/Index.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { Users, Calendar, User, File, BookOpen, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Définition de l'interface pour une session
interface Session {
  _id: string;
  title: string;
  dateDebut: string;
  dateFin: string;
  trainer: string;
  participantsInscrits: number;
  capaciteMax: number;
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée";
}

// Nouvelle interface pour les données de statistiques d'employés
interface EmployeeStats {
  service: string;
  poste: string;
  count: number;
}

// Nouvelle interface pour les données de sessions mensuelles
interface MonthlySessionData {
  name: string; // Nom du mois (ex: "Jan")
  value: number; // Nombre de sessions
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ÉTATS pour les données dynamiques
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [stagiaireCount, setStagiaireCount] = useState<number>(0);
  const [formationCount, setFormationCount] = useState<number>(0);
  const [partnerCount, setPartnerCount] = useState<number>(0);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  // États pour les stats employés
  const [employeeStatsByService, setEmployeeStatsByService] = useState<
    { name: string; value: number; color?: string }[]
  >([]);
  const [employeeStatsByPoste, setEmployeeStatsByPoste] = useState<
    { name: string; value: number; color?: string }[]
  >([]);
  const [loadingEmployeeStats, setLoadingEmployeeStats] = useState(true);
  const [errorEmployeeStats, setErrorEmployeeStats] = useState<string | null>(
    null
  );

  // NOUVEAUX ÉTATS pour les sessions mensuelles
  const [monthlySessionsChartData, setMonthlySessionsChartData] = useState<
    MonthlySessionData[]
  >([]);
  const [loadingMonthlySessions, setLoadingMonthlySessions] = useState(true);
  const [errorMonthlySessions, setErrorMonthlySessions] = useState<
    string | null
  >(null);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);
  const [loadingStagiaires, setLoadingStagiaires] = useState(true);
  const [errorStagiaires, setErrorStagiaires] = useState<string | null>(null);
  const [loadingFormations, setLoadingFormations] = useState(true);
  const [errorFormations, setErrorFormations] = useState<string | null>(null);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [errorPartners, setErrorPartners] = useState<string | null>(null);
  const [loadingRecentSessions, setLoadingRecentSessions] = useState(true);
  const [errorRecentSessions, setErrorRecentSessions] = useState<string | null>(
    null
  );

  // Fonctions fetch existantes (inchangées)
  const fetchEmployeeCount = useCallback(async () => {
    setLoadingEmployees(true);
    setErrorEmployees(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees/count`);
      setEmployeeCount(response.data.count);
    } catch (error: any) {
      setErrorEmployees(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger le nombre d'employés.",
        variant: "destructive",
      });
    } finally {
      setLoadingEmployees(false);
    }
  }, [API_BASE_URL, toast]);

  const fetchStagiaireCount = useCallback(async () => {
    setLoadingStagiaires(true);
    setErrorStagiaires(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stagiaires/count`);
      setStagiaireCount(response.data.count);
    } catch (error: any) {
      setErrorStagiaires(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger le nombre de stagiaires.",
        variant: "destructive",
      });
    } finally {
      setLoadingStagiaires(false);
    }
  }, [API_BASE_URL, toast]);

  const fetchFormationCount = useCallback(async () => {
    setLoadingFormations(true);
    setErrorFormations(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/formations/count`);
      setFormationCount(response.data.count);
    } catch (error: any) {
      setErrorFormations(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger le nombre de formations.",
        variant: "destructive",
      });
    } finally {
      setLoadingFormations(false);
    }
  }, [API_BASE_URL, toast]);

  const fetchPartnerCount = useCallback(async () => {
    setLoadingPartners(true);
    setErrorPartners(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/partners/count`);
      setPartnerCount(response.data.count);
    } catch (error: any) {
      setErrorPartners(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger le nombre de partenaires.",
        variant: "destructive",
      });
    } finally {
      setLoadingPartners(false);
    }
  }, [API_BASE_URL, toast]);

  const fetchRecentSessions = useCallback(async () => {
    setLoadingRecentSessions(true);
    setErrorRecentSessions(null);
    try {
      const response = await axios.get<Session[]>(
        `${API_BASE_URL}/api/sessions/recent`
      );
      setRecentSessions(response.data);
    } catch (error: any) {
      setErrorRecentSessions(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions récentes.",
        variant: "destructive",
      });
    } finally {
      setLoadingRecentSessions(false);
    }
  }, [API_BASE_URL, toast]);

  // FONCTION pour récupérer et formater les stats employés
  const fetchEmployeeStats = useCallback(async () => {
    setLoadingEmployeeStats(true);
    setErrorEmployeeStats(null);
    try {
      const response = await axios.get<EmployeeStats[]>(
        `${API_BASE_URL}/api/employees/stats/roles-services`
      );

      // Agrégation des données pour le graphique "Employés par Service"
      const statsByService: { [key: string]: number } = {};
      response.data.forEach((stat) => {
        if (statsByService[stat.service]) {
          statsByService[stat.service] += stat.count;
        } else {
          statsByService[stat.service] = stat.count;
        }
      });
      const formattedServiceData = Object.keys(statsByService).map(
        (service) => ({
          name: service,
          value: statsByService[service],
        })
      );
      setEmployeeStatsByService(formattedServiceData);

      // Agrégation des données pour le graphique "Employés par Poste"
      const statsByPoste: { [key: string]: number } = {};
      response.data.forEach((stat) => {
        if (statsByPoste[stat.poste]) {
          statsByPoste[stat.poste] += stat.count;
        } else {
          statsByPoste[stat.poste] = stat.count;
        }
      });
      const formattedPosteData = Object.keys(statsByPoste).map((poste) => ({
        name: poste,
        value: statsByPoste[poste],
      }));
      setEmployeeStatsByPoste(formattedPosteData);
    } catch (error: any) {
      setErrorEmployeeStats(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques d'employés.",
        variant: "destructive",
      });
    } finally {
      setLoadingEmployeeStats(false);
    }
  }, [API_BASE_URL, toast]);

  // NOUVELLE FONCTION pour récupérer les sessions mensuelles
  const fetchMonthlySessions = useCallback(async () => {
    setLoadingMonthlySessions(true);
    setErrorMonthlySessions(null);
    try {
      const response = await axios.get<MonthlySessionData[]>(
        `${API_BASE_URL}/api/sessions/monthly-counts`
      );
      setMonthlySessionsChartData(response.data);
    } catch (error: any) {
      setErrorMonthlySessions(error.message);
      toast({
        title: "Erreur",
        description:
          "Impossible de charger les données des sessions mensuelles.",
        variant: "destructive",
      });
    } finally {
      setLoadingMonthlySessions(false);
    }
  }, [API_BASE_URL, toast]);

  useEffect(() => {
    fetchEmployeeCount();
    fetchStagiaireCount();
    fetchFormationCount();
    fetchPartnerCount();
    fetchRecentSessions();
    fetchEmployeeStats();
    fetchMonthlySessions(); // <-- Appel de la nouvelle fonction ici
  }, [
    fetchEmployeeCount,
    fetchStagiaireCount,
    fetchFormationCount,
    fetchPartnerCount,
    fetchRecentSessions,
    fetchEmployeeStats,
    fetchMonthlySessions, // <-- Ajout aux dépendances
  ]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      return date.toLocaleDateString("fr-FR", options);
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return "Date invalide";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">
            Vue d'overview des activités d'EPIE Formation
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REMPLACEMENT : Sessions de Formation par Mois (Bar Chart) - Maintenant dynamique */}
          <ChartCard
            title="Sessions de Formation par Mois"
            subtitle="Évolution sur les 6 derniers mois"
            type="bar"
            data={
              loadingMonthlySessions
                ? []
                : errorMonthlySessions
                ? [{ name: "Erreur", value: 1, color: "#EF4444" }]
                : monthlySessionsChartData
            }
            dataKey="value"
            nameKey="name"
            colors={["#4A90E2"]} // Couleur unique pour les barres, tu peux la changer
          />

          {/* Graphique existant : Employés par Service */}
          <ChartCard
            title="Employés par Service"
            subtitle="Répartition du personnel par département"
            type="pie"
            data={
              loadingEmployeeStats
                ? []
                : errorEmployeeStats
                ? [{ name: "Erreur de chargement", value: 1, color: "#EF4444" }]
                : employeeStatsByService
            }
            dataKey="value"
            nameKey="name"
            colors={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {loadingRecentSessions ? (
                <p className="text-center text-gray-500">
                  Chargement des sessions...
                </p>
              ) : errorRecentSessions ? (
                <p className="text-center text-red-500">
                  Erreur: {errorRecentSessions}
                </p>
              ) : recentSessions.length === 0 ? (
                <p className="text-center text-gray-500">
                  Aucune session récente trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {session.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>
                            <Calendar className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                            {formatDate(session.dateDebut)} -{" "}
                            {formatDate(session.dateFin)}
                          </span>
                          {session.trainer && (
                            <span>
                              <User className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                              {session.trainer}{" "}
                            </span>
                          )}
                          <span>
                            <Users className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                            {session.participantsInscrits} /{" "}
                            {session.capaciteMax} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.statut === "En cours"
                              ? "bg-green-100 text-green-700"
                              : session.statut === "Planifiée"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {session.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
