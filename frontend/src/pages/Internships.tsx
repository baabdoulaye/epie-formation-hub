// frontend/src/pages/Internships.tsx
import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import AddInternshipForm from "@/components/internships/AddInternshipForm";
import EditInternshipForm from "@/components/internships/EditInternshipForm"; // Assure-toi que ce fichier existe
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Search,
  Plus,
  ArrowLeft,
  Building,
  User, // Garder l'icône User
  Trash,
  Edit,
  Info, // Pour le statut/évaluation
  Clock, // Pour la durée du stage
  Calendar, // Pour les dates de stage
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Définition locale de l'interface Internship (à adapter selon ton schéma réel)
export interface Internship {
  id: string;
  _id?: string;
  student_name: string; // NOUVEAU : Nom du stagiaire
  student_id?: string | null; // Rendu optionnel et peut être null
  entreprise: string;
  tuteur_entreprise: string;
  email_tuteur: string;
  telephone_tuteur: string;
  date_debut: string;
  date_fin: string;
  duree_semaines?: number | null;
  objectifs: string;
  competences_visees?: string[];
  statut: "En cours" | "Terminé" | "Annulé";
  evaluation?: number | null;
  commentaires?: string;
}

// URL de base de l'API pour les stages
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/internships";

// Définir le type InternshipFormData basé sur le schéma Zod des formulaires
type InternshipFormData = {
  student_name: string; // NOUVEAU : Nom du stagiaire
  student_id?: string | null;
  entreprise: string;
  tuteur_entreprise: string;
  email_tuteur: string;
  telephone_tuteur: string;
  date_debut: string;
  date_fin: string;
  duree_semaines?: number | null;
  objectifs: string;
  competences_visees?: string[];
  statut: "En cours" | "Terminé" | "Annulé";
  evaluation?: number | null;
  commentaires?: string;
};

const Internships: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Internship[]>(API_BASE_URL);
      const fetchedInternships = response.data.map((internship) => ({
        ...internship,
        id: internship._id || internship.id, // Assure que 'id' est bien le _id de MongoDB
        date_debut: new Date(internship.date_debut).toISOString().split("T")[0],
        date_fin: new Date(internship.date_fin).toISOString().split("T")[0],
        // Si student_name n'est pas encore dans la BDD, assure une valeur par défaut
        student_name: internship.student_name || "Stagiaire Inconnu", // Gestion rétro-compatible
      }));
      setInternships(fetchedInternships);
    } catch (err) {
      console.error("Erreur lors de la récupération des stages:", err);
      setError(
        "Impossible de charger les stages. Veuillez réessayer plus tard."
      );
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les stages depuis le serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const filteredInternships = internships.filter(
    (internship) =>
      internship.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.tuteur_entreprise
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      internship.objectifs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.student_name.toLowerCase().includes(searchTerm.toLowerCase()) // NOUVEAU : Recherche par nom du stagiaire
  );

  const handleAddInternship = async (data: InternshipFormData) => {
    try {
      setLoading(true);
      const dataToSend = {
        ...data,
        date_debut: new Date(data.date_debut).toISOString(),
        date_fin: new Date(data.date_fin).toISOString(),
      };
      const response = await axios.post<Internship>(API_BASE_URL, dataToSend);
      const newInternship = {
        ...response.data,
        id: response.data._id || response.data.id,
        date_debut: new Date(response.data.date_debut)
          .toISOString()
          .split("T")[0],
        date_fin: new Date(response.data.date_fin).toISOString().split("T")[0],
        student_name: response.data.student_name || "Stagiaire Inconnu", // Assure la présence du nom
      };
      setInternships((prevInternships) => [...prevInternships, newInternship]);
      toast({
        title: "Stage ajouté avec succès",
        description: `Le stage de "${newInternship.student_name}" chez "${newInternship.entreprise}" a été ajouté.`,
      });
      setShowAddForm(false);
    } catch (error: any) {
      console.error("Erreur lors de la création du stage:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'ajout du stage.";
      toast({
        title: "Échec de l'ajout",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditForm = (internship: Internship) => {
    setEditingInternship(internship);
    setShowAddForm(false);
  };

  const handleUpdateInternship = async (data: InternshipFormData) => {
    if (!editingInternship) return;

    try {
      setLoading(true);
      const dataToSend = {
        ...data,
        date_debut: new Date(data.date_debut).toISOString(),
        date_fin: new Date(data.date_fin).toISOString(),
      };
      const response = await axios.put<Internship>(
        `${API_BASE_URL}/${editingInternship.id}`,
        dataToSend
      );
      const updatedInternship = {
        ...response.data,
        id: response.data._id || response.data.id,
        date_debut: new Date(response.data.date_debut)
          .toISOString()
          .split("T")[0],
        date_fin: new Date(response.data.date_fin).toISOString().split("T")[0],
        student_name: response.data.student_name || "Stagiaire Inconnu", // Assure la présence du nom
      };
      setInternships((prevInternships) =>
        prevInternships.map((s) =>
          s.id === updatedInternship.id ? updatedInternship : s
        )
      );
      toast({
        title: "Stage modifié avec succès",
        description: `Le stage de "${updatedInternship.student_name}" chez "${updatedInternship.entreprise}" a été mis à jour.`,
      });
      setEditingInternship(null);
    } catch (error: any) {
      console.error("Erreur lors de la modification du stage:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la modification du stage.";
      toast({
        title: "Échec de la modification",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async (
    internshipId: string,
    studentName: string, // Changé pour afficher le nom du stagiaire dans la confirmation
    entrepriseName: string
  ) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le stage de "${studentName}" chez "${entrepriseName}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/${internshipId}`);
      setInternships((prevInternships) =>
        prevInternships.filter((internship) => internship.id !== internshipId)
      );
      toast({
        title: "Stage supprimé",
        description: `Le stage de "${studentName}" chez "${entrepriseName}" a été supprimé avec succès.`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression du stage:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la suppression du stage.";
      toast({
        title: "Échec de la suppression",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingInternship(null);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "En cours":
        return "bg-blue-100 text-blue-700";
      case "Terminé":
        return "bg-green-100 text-green-700";
      case "Annulé":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (editingInternship) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux stages</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier le Stage
              </h1>
              <p className="text-gray-600 mt-1">
                Mettez à jour les informations du stage existant
              </p>
            </div>
          </div>
          <EditInternshipForm
            internship={editingInternship}
            onSubmit={handleUpdateInternship}
            onCancel={handleCancelForm}
          />
        </div>
      </Layout>
    );
  }

  if (showAddForm) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux stages</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un Nouveau Stage
              </h1>
              <p className="text-gray-600 mt-1">
                Enregistrez un nouveau stage pour un étudiant
              </p>
            </div>
          </div>
          <AddInternshipForm
            onSubmit={handleAddInternship}
            onCancel={handleCancelForm}
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
              {loading
                ? "Chargement..."
                : `${filteredInternships.length} stages • ${
                    filteredInternships.filter((s) => s.statut === "En cours")
                      .length
                  } en cours`}
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setShowAddForm(true);
              setEditingInternship(null);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Stage
          </Button>
        </div>

        {/* Barre de recherche et filtres (simplifiés) */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par entreprise, tuteur, étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affichage du chargement ou de l'erreur */}
        {loading && (
          <div className="text-center py-8 text-gray-600">
            Chargement des stages...
          </div>
        )}
        {error && <div className="text-center py-8 text-red-600">{error}</div>}

        {/* Liste des stages */}
        {!loading && !error && filteredInternships.length > 0 && (
          <div className="space-y-4">
            {filteredInternships.map((internship) => (
              <Card
                key={internship.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          {/* NOUVEAU: Affichage du nom du stagiaire avec une icône */}
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            <span>{internship.student_name}</span>
                          </h3>
                          {/* Ancien titre pour l'entreprise, adapté */}
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Building className="h-4 w-4" />
                            <span>chez {internship.entreprise}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Tuteur: {internship.tuteur_entreprise}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Du{" "}
                            {new Date(internship.date_debut).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            au{" "}
                            {new Date(internship.date_fin).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        {internship.duree_semaines !== null &&
                          internship.duree_semaines !== undefined && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{internship.duree_semaines} semaines</span>
                            </div>
                          )}
                        {internship.evaluation !== null &&
                          internship.evaluation !== undefined && (
                            <div className="flex items-center space-x-2">
                              <Info className="h-4 w-4" />
                              <span>
                                Évaluation:{" "}
                                {internship.evaluation !== null
                                  ? `${internship.evaluation}/20`
                                  : "N/A"}
                              </span>
                            </div>
                          )}
                      </div>

                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                        **Objectifs:** {internship.objectifs}
                      </p>
                      {internship.competences_visees &&
                        internship.competences_visees.length > 0 && (
                          <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                            **Compétences visées:**{" "}
                            {internship.competences_visees.join(", ")}
                          </p>
                        )}
                      {internship.commentaires && (
                        <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                          **Commentaires:** {internship.commentaires}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          internship.statut
                        )}`}
                      >
                        {internship.statut}
                      </span>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditForm(internship)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteInternship(
                              internship.id,
                              internship.student_name, // Passe le nom du stagiaire
                              internship.entreprise
                            )
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

        {/* Message si aucun stage trouvé */}
        {!loading && !error && filteredInternships.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun stage trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Aucun stage ne correspond à votre recherche."
                  : "Commencez par ajouter votre premier stage."}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Stage
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Internships;
