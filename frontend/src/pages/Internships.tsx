// frontend/src/pages/Internships.tsx
import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import AddInternshipForm from "@/components/internships/AddInternshipForm";
import EditInternshipForm from "@/components/internships/EditInternshipForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Importation de Label pour le select
import {
  Briefcase,
  Search,
  Plus,
  ArrowLeft,
  Building,
  User,
  Trash,
  Edit,
  Info,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Tag,
  BookOpen, // Nouvelle icône pour la formation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Définition des options de secteur
const SECTEUR_OPTIONS = [
  "Tous", // Option pour afficher tous les secteurs
  "Technologie",
  "Services",
  "Commerce",
  "Industrie",
  "Santé",
  "Finance",
  "Construction",
];

// Définition de l'interface Internship, alignée avec le modèle Stage du backend
export interface Internship {
  id: string;
  _id?: string; // MongoDB _id
  student_name: string;
  student_id?: string | null;
  student_adresse?: string;
  student_telephone?: string;
  student_email?: string;

  entreprise: string;
  entreprise_adresse?: string;
  entreprise_ville?: string;
  entreprise_code_postal?: string;
  secteur?: string;
  formation_suivie?: string; // NOUVEAU: Champ formation_suivie

  tuteur_entreprise?: string;
  email_tuteur?: string;
  telephone_tuteur?: string;
  date_debut: string; // Sera une chaîne ISO (YYYY-MM-DD)
  date_fin: string; // Sera une chaîne ISO (YYYY-MM-DD)
  duree_semaines?: number | null;
  objectifs?: string;
  competences_visees?: string[];
  statut: "En cours" | "Terminé" | "Planifié"; // Statuts définis par le backend
  evaluation?: number | null;
  commentaires?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Définition de l'interface pour les données du formulaire
export type InternshipFormData = {
  student_name: string;
  student_adresse?: string;
  student_telephone?: string;
  student_email?: string;

  entreprise: string;
  entreprise_adresse?: string;
  entreprise_ville?: string;
  entreprise_code_postal?: string;
  secteur?: string;
  formation_suivie?: string; // NOUVEAU: Champ formation_suivie dans le formulaire

  tuteur_entreprise?: string;
  email_tuteur?: string;
  telephone_tuteur?: string;
  date_debut: string; // Format YYYY-MM-DD
  date_fin: string; // Format YYYY-MM-DD
  objectifs?: string;
  competences_visees?: string[];
  evaluation?: number | null;
  commentaires?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/internships";

const Internships: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState<string>("Tous");
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour récupérer les stages depuis l'API avec filtre secteur
  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedSecteur && selectedSecteur !== "Tous") {
        params.append("secteur", selectedSecteur);
      }
      const response = await axios.get<Internship[]>(
        `${API_BASE_URL}?${params.toString()}`
      );

      const fetchedInternships = response.data.map((internship) => ({
        ...internship,
        id: internship._id || internship.id,
        date_debut: new Date(internship.date_debut).toISOString().split("T")[0],
        date_fin: new Date(internship.date_fin).toISOString().split("T")[0],
        student_name: internship.student_name || "Stagiaire Inconnu",
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
  }, [toast, selectedSecteur]);

  // Effet pour charger les stages au montage du composant et lors du changement de filtre
  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  // Filtrage des stages basés sur le terme de recherche (le filtrage par secteur est maintenant côté backend)
  const filteredInternships = internships.filter(
    (internship) =>
      internship.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (internship.tuteur_entreprise &&
        internship.tuteur_entreprise
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.objectifs &&
        internship.objectifs
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      internship.student_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (internship.entreprise_adresse &&
        internship.entreprise_adresse
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.entreprise_ville &&
        internship.entreprise_ville
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.entreprise_code_postal &&
        internship.entreprise_code_postal
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.student_adresse &&
        internship.student_adresse
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.student_telephone &&
        internship.student_telephone
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.student_email &&
        internship.student_email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (internship.formation_suivie &&
        internship.formation_suivie
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) // NOUVEAU: Recherche par formation
  );

  // Gère l'ajout d'un nouveau stage
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
        student_name: response.data.student_name || "Stagiaire Inconnu",
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

  // Ouvre le formulaire de modification avec les données du stage sélectionné
  const handleOpenEditForm = (internship: Internship) => {
    setEditingInternship(internship);
    setShowAddForm(false);
  };

  // Gère la mise à jour d'un stage existant
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
        student_name: response.data.student_name || "Stagiaire Inconnu",
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

  // Gère la suppression d'un stage
  const handleDeleteInternship = async (
    internshipId: string,
    studentName: string,
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

  // Annule l'affichage des formulaires d'ajout/modification
  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingInternship(null);
  };

  // Détermine la couleur du badge de statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "En cours":
        return "bg-blue-100 text-blue-700";
      case "Terminé":
        return "bg-green-100 text-green-700";
      case "Planifié":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Rendu conditionnel des formulaires d'ajout/modification
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

  // Rendu de la liste des stages
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

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par entreprise, tuteur, étudiant, formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Filtre par secteur */}
              <div className="relative">
                <Label htmlFor="secteur-filter" className="sr-only">
                  Filtrer par secteur
                </Label>
                <select
                  id="secteur-filter"
                  value={selectedSecteur}
                  onChange={(e) => setSelectedSecteur(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {SECTEUR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option === "Tous" ? "Tous les secteurs" : option}
                    </option>
                  ))}
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
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            <span>{internship.student_name}</span>
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Building className="h-4 w-4" />
                            <span>chez {internship.entreprise}</span>
                          </p>
                          {/* NOUVEAU: Affichage de la formation suivie de manière plus visible */}
                          {internship.formation_suivie && (
                            <p className="text-md font-semibold text-gray-800 flex items-center gap-1 mt-2">
                              <BookOpen className="h-5 w-5 text-purple-600" />
                              <span>
                                Formation: {internship.formation_suivie}
                              </span>
                            </p>
                          )}
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

                      {/* Affichage des informations du stagiaire */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                        {internship.student_adresse && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              Adresse Stagiaire: {internship.student_adresse}
                            </span>
                          </div>
                        )}
                        {internship.student_telephone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>
                              Tél. Stagiaire: {internship.student_telephone}
                            </span>
                          </div>
                        )}
                        {internship.student_email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>
                              Email Stagiaire: {internship.student_email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Affichage des informations de l'entreprise */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                        {internship.entreprise_adresse && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              Adresse Entreprise:{" "}
                              {internship.entreprise_adresse}
                            </span>
                          </div>
                        )}
                        {internship.entreprise_ville && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              Ville Entreprise: {internship.entreprise_ville}
                            </span>
                          </div>
                        )}
                        {internship.entreprise_code_postal && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              Code Postal Entreprise:{" "}
                              {internship.entreprise_code_postal}
                            </span>
                          </div>
                        )}
                        {internship.secteur && (
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4" />
                            <span>Secteur: {internship.secteur}</span>
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
                      {/* Badge de statut */}
                      {internship.statut && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            internship.statut
                          )}`}
                        >
                          {internship.statut}
                        </span>
                      )}

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
                              internship.student_name,
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
