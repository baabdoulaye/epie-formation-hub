// frontend/src/pages/Sessions.tsx
import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import AddSessionForm from "@/components/sessions/AddSessionForm";
import EditSessionForm from "@/components/sessions/EditSessionForm"; // NOUVEAU: Import du composant de modification
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Plus,
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Assure-toi que l'URL de ton API est correcte.
// Si ton backend tourne sur http://localhost:5000, utilise cette URL.
// Pour les variables d'environnement Next.js, elles doivent commencer par NEXT_PUBLIC_
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/sessions";

interface Session {
  id: string; // Garde ceci pour l'utilisation dans le code React (clés, etc.)
  _id?: string; // Ajouté pour gérer le _id retourné par MongoDB, rendu optionnel
  title: string;
  formation: string;
  formateur: string;
  dateDebut: string; // Garder comme string pour l'affichage (YYYY-MM-DD), convertir si besoin pour l'API (Date)
  dateFin: string; // Garder comme string pour l'affichage (YYYY-MM-DD)
  heureDebut: string;
  heureFin: string;
  lieu: string;
  capaciteMax: number;
  participantsInscrits: number;
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée";
  description?: string;
}

// Définir le type SessionFormData basé sur le schéma Zod du formulaire
// (Tu devrais le copier du fichier AddSessionForm ou EditSessionForm pour être sûr de la cohérence)
// Je le définis ici pour la clarté, mais idéalement il viendrait d'un fichier partagé si les schémas sont identiques.
type SessionFormData = Omit<
  Session,
  "id" | "_id" | "participantsInscrits" | "statut"
>;

const Sessions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null); // NOUVEAU: État pour la session en cours de modification
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]); // État pour stocker les sessions réelles
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
  const { toast } = useToast();

  // Fonction pour récupérer les sessions depuis l'API
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Session[]>(API_BASE_URL);
      // Mappe '_id' de MongoDB vers 'id' pour la compatibilité avec ton interface
      // et s'assure que les dates sont des strings valides pour l'affichage
      const fetchedSessions = response.data.map((session) => ({
        ...session,
        id: session._id || session.id, // Utilise _id en priorité si présent
        // Convertir les dates ISO en format YYYY-MM-DD pour les inputs de type "date"
        dateDebut: session.dateDebut
          ? new Date(session.dateDebut).toISOString().split("T")[0]
          : "",
        dateFin: session.dateFin
          ? new Date(session.dateFin).toISOString().split("T")[0]
          : "",
      }));
      setSessions(fetchedSessions);
    } catch (err) {
      console.error("Erreur lors de la récupération des sessions:", err);
      setError(
        "Impossible de charger les sessions. Veuillez réessayer plus tard."
      );
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les sessions depuis le serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Appel de la fonction de récupération au montage du composant
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Filtration des sessions
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.formateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer l'ajout d'une session
  const handleAddSession = async (data: SessionFormData) => {
    // Le modèle backend gère les valeurs par défaut pour participantsInscrits et statut
    const sessionDataToSend = {
      ...data,
      // Convertir les dates du format 'YYYY-MM-DD' vers des objets Date ISO string
      dateDebut: new Date(data.dateDebut).toISOString(),
      dateFin: new Date(data.dateFin).toISOString(),
      // capaciteMax est déjà un nombre grâce à z.preprocess dans le schéma
    };

    try {
      setLoading(true); // Active le chargement pendant l'ajout
      const response = await axios.post<Session>(
        API_BASE_URL,
        sessionDataToSend
      );
      const newSession = {
        ...response.data,
        id: response.data._id || response.data.id, // S'assurer que 'id' est bien défini pour React
        // Convertir les dates de la réponse en format 'YYYY-MM-DD' pour l'état local
        dateDebut: new Date(response.data.dateDebut)
          .toISOString()
          .split("T")[0],
        dateFin: new Date(response.data.dateFin).toISOString().split("T")[0],
      };
      setSessions((prevSessions) => [...prevSessions, newSession]); // Ajoute la nouvelle session à l'état
      toast({
        title: "Session planifiée avec succès",
        description: `La session "${newSession.title}" a été créée et ajoutée au planning.`,
      });
      setShowAddForm(false); // Cache le formulaire après succès
    } catch (error: any) {
      console.error("Erreur lors de la création de la session:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la création de la session.";
      toast({
        title: "Échec de la planification",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Désactive le chargement
    }
  };

  // NOUVEAU: Gérer l'ouverture du formulaire de modification
  const handleOpenEditForm = (session: Session) => {
    setEditingSession(session); // Définit la session à modifier
    setShowAddForm(false); // S'assurer que le formulaire d'ajout n'est pas affiché en même temps
  };

  // NOUVEAU: Gérer la soumission du formulaire de modification
  const handleUpdateSession = async (data: SessionFormData) => {
    if (!editingSession) return; // Ne devrait pas arriver si le formulaire est affiché

    const sessionDataToSend = {
      ...data,
      dateDebut: new Date(data.dateDebut).toISOString(),
      dateFin: new Date(data.dateFin).toISOString(),
      // capaciteMax est déjà un nombre
    };

    try {
      setLoading(true);
      const response = await axios.put<Session>(
        `${API_BASE_URL}/${editingSession.id}`, // Utilise l'ID de la session à modifier
        sessionDataToSend
      );
      const updatedSession = {
        ...response.data,
        id: response.data._id || response.data.id,
        dateDebut: new Date(response.data.dateDebut)
          .toISOString()
          .split("T")[0],
        dateFin: new Date(response.data.dateFin).toISOString().split("T")[0],
      };
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === updatedSession.id ? updatedSession : s
        )
      ); // Met à jour la session dans la liste
      toast({
        title: "Session modifiée avec succès",
        description: `La session "${updatedSession.title}" a été mise à jour.`,
      });
      setEditingSession(null); // Cache le formulaire de modification
    } catch (error: any) {
      console.error("Erreur lors de la modification de la session:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la modification de la session.";
      toast({
        title: "Échec de la modification",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // NOUVEAU: Fonction pour annuler la modification
  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  // Gérer la suppression d'une session
  const handleDeleteSession = async (
    sessionId: string,
    sessionTitle: string
  ) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer la session "${sessionTitle}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/${sessionId}`);
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      ); // Supprime de l'état
      toast({
        title: "Session supprimée",
        description: `La session "${sessionTitle}" a été supprimée avec succès.`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la session:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la suppression de la session.";
      toast({
        title: "Échec de la suppression",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "En cours":
        return "bg-green-100 text-green-700";
      case "Planifiée":
        return "bg-blue-100 text-blue-700";
      case "Terminée":
        return "bg-gray-100 text-gray-700";
      case "Annulée":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // NOUVEAU: Condition pour afficher le formulaire de modification
  if (editingSession) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux sessions</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier la Session
              </h1>
              <p className="text-gray-600 mt-1">
                Mettez à jour les informations de la session existante
              </p>
            </div>
          </div>

          <EditSessionForm
            session={editingSession} // Passe la session à modifier
            onSubmit={handleUpdateSession}
            onCancel={handleCancelEdit}
          />
        </div>
      </Layout>
    );
  }

  // Ancien code pour l'ajout, maintenant après la condition de modification
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
              {loading
                ? "Chargement..."
                : `${filteredSessions.length} sessions • ${
                    filteredSessions.filter((s) => s.statut === "En cours")
                      .length
                  } en cours`}
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setShowAddForm(true);
              setEditingSession(null); // Assure que le formulaire de modification est caché
            }}
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

        {/* Affichage du chargement ou de l'erreur */}
        {loading && (
          <div className="text-center py-8 text-gray-600">
            Chargement des sessions...
          </div>
        )}
        {error && <div className="text-center py-8 text-red-600">{error}</div>}

        {/* Liste des sessions */}
        {!loading && !error && filteredSessions.length > 0 && (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-lg transition-shadow"
              >
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
                          <span>
                            Du{" "}
                            {new Date(session.dateDebut).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            au{" "}
                            {new Date(session.dateFin).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {session.heureDebut} - {session.heureFin}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{session.lieu}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {session.participantsInscrits}/{session.capaciteMax}{" "}
                            participants
                          </span>
                        </div>
                      </div>

                      {session.description && (
                        <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                          {session.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          session.statut
                        )}`}
                      >
                        {session.statut}
                      </span>

                      <div className="flex space-x-2">
                        {/* NOUVEAU: Le bouton Modifier est maintenant fonctionnel */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditForm(session)} // Appel à la nouvelle fonction
                        >
                          <Edit className="h-4 w-4 mr-1" /> Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteSession(session.id, session.title)
                          }
                        >
                          <Trash className="h-4 w-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Message si aucune session trouvée après filtrage ou chargement */}
        {!loading && !error && filteredSessions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Aucune session ne correspond à votre recherche."
                  : "Commencez par planifier votre première session."}
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
