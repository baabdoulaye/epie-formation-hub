// frontend/src/pages/Students.tsx
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import AddStudentForm from "@/components/students/AddStudentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assurez-vous que Input est bien importé ici
import {
  Users,
  Search,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Building2,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react"; // Ajout d'icônes pertinentes
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Stagiaire {
  _id: string; // L'ID généré par MongoDB
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  age?: number;
  address?: string;
  postalCode?: string;
  city?: string;
  department?: string;
  birthCity?: string;
  birthCountry?: string;
  prescribingOrganization?: string;
  prescribingCity?: string;
  educationLevel?: string;
  infoCollectiveDate?: string;
  presentAtInfoCollective?: boolean;
  presentAtIndividualInterview?: boolean;
  positioning?: string;
  centerDecision?: string;
  result?: string;
  pathway1?: string;
  pathway2?: string;
  candidateInformation?: string;
  formation?: string; // Si ce champ est utilisé pour l'affichage de la formation liée
  statut?: string; // Statut du stagiaire (Actif, Diplômé, Abandonné, etc.)
}

// Utilisation de la variable d'environnement pour l'URL de base
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Students: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null
  ); // Nouvel état pour gérer l'expansion
  const [searchTerm, setSearchTerm] = useState<string>(""); // Ajout de l'état pour la barre de recherche

  const { toast } = useToast();
  const [stagiairesList, setStagiairesList] = useState<Stagiaire[]>([]);

  const fetchStagiaires = async () => {
    try {
      const response = await axios.get<Stagiaire[]>(
        `${API_BASE_URL}/api/stagiaires`
      ); // Utilisation de API_BASE_URL
      setStagiairesList(response.data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des stagiaires:", error);
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger la liste des stagiaires : ${
          error.message || "Problème de connexion API"
        }`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStagiaires();
  }, []);

  const handleAddStudent = async (data: any) => {
    console.log("Données du nouveau stagiaire (frontend):", data);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/stagiaires`, // Utilisation de API_BASE_URL
        data
      );
      console.log(
        "Stagiaire ajouté via API (réponse frontend):",
        response.data
      );

      toast({
        title: "Stagiaire ajouté avec succès",
        description: `${data.firstName || "Nouveau stagiaire"} ${
          data.lastName || ""
        } a été ajouté à la base de données.`,
      });

      fetchStagiaires(); // Rafraîchir la liste
      setShowAddForm(false);
    } catch (error: any) {
      console.error(
        "Erreur lors de l'ajout du stagiaire (frontend):",
        error.response?.data || error.message
      );
      toast({
        title: "Erreur lors de l'ajout",
        description: `Impossible d'ajouter le stagiaire : ${
          error.response?.data?.message || error.message
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (data: any) => {
    console.log("Données du stagiaire modifié (frontend):", data);

    try {
      if (!data._id) {
        throw new Error("L'ID du stagiaire est manquant pour la modification.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/stagiaires/${data._id}`, // Utilisation de API_BASE_URL
        data
      );
      console.log(
        "Stagiaire modifié via API (réponse frontend):",
        response.data
      );

      toast({
        title: "Stagiaire modifié avec succès",
        description: `${data.firstName || ""} ${
          data.lastName || ""
        } a été mis à jour.`,
      });

      fetchStagiaires(); // Rafraîchir la liste
      setEditingStudent(null);
    } catch (error: any) {
      console.error(
        "Erreur lors de la modification du stagiaire (frontend):",
        error.response?.data || error.message
      );
      toast({
        title: "Erreur lors de la modification",
        description: `Impossible de modifier le stagiaire : ${
          error.response?.data?.message || error.message
        }`,
        variant: "destructive",
      });
    }
  };

  // Fonction pour gérer la suppression
  const handleDeleteStudent = async (
    stagiaireId: string,
    studentName: string
  ) => {
    // Remplacer window.confirm par une modale personnalisée si tu utilises shadcn/ui pour une meilleure UX
    if (
      !window.confirm(
        `Es-tu sûr de vouloir supprimer le stagiaire "${studentName}" ? Cette action est irréversible.`
      )
    ) {
      return; // Annule la suppression si l'utilisateur annule la confirmation
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/stagiaires/${stagiaireId}`); // Utilisation de API_BASE_URL
      toast({
        title: "Stagiaire supprimé avec succès",
        description: `${studentName} a été retiré de la base de données.`,
      });
      fetchStagiaires(); // Rafraîchir la liste des stagiaires après la suppression
    } catch (error: any) {
      console.error("Erreur lors de la suppression du stagiaire:", error);
      toast({
        title: "Erreur lors de la suppression",
        description: `Impossible de supprimer le stagiaire : ${
          error.response?.data?.message || error.message
        }`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStudent(null);
  };

  const handleEditStudentClick = (stagiaire: Stagiaire) => {
    // Mappage des données pour le formulaire de modification
    const mappedData = {
      _id: stagiaire._id,
      firstName: stagiaire.firstName,
      lastName: stagiaire.lastName,
      email: stagiaire.email,
      phone: stagiaire.phone,
      birthDate: stagiaire.birthDate,
      age: stagiaire.age,
      address: stagiaire.address,
      postalCode: stagiaire.postalCode,
      city: stagiaire.city,
      department: stagiaire.department,
      birthCity: stagiaire.birthCity,
      birthCountry: stagiaire.birthCountry,
      prescribingOrganization: stagiaire.prescribingOrganization,
      prescribingCity: stagiaire.prescribingCity,
      educationLevel: stagiaire.educationLevel,
      infoCollectiveDate: stagiaire.infoCollectiveDate,
      presentAtInfoCollective: stagiaire.presentAtInfoCollective,
      presentAtIndividualInterview: stagiaire.presentAtIndividualInterview,
      positioning: stagiaire.positioning,
      centerDecision: stagiaire.centerDecision,
      result: stagiaire.result,
      pathway1: stagiaire.pathway1,
      pathway2: stagiaire.pathway2,
      candidateInformation: stagiaire.candidateInformation,
      formation: stagiaire.formation,
      statut: stagiaire.statut,
    };
    console.log(
      "Données mappées pour le formulaire de modification:",
      mappedData
    );
    setEditingStudent(mappedData);
  };

  // Fonction pour basculer l'affichage des détails
  const toggleDetails = (id: string) => {
    setExpandedStudentId((prevId) => (prevId === id ? null : id));
  };

  // Filtrage des stagiaires basé sur le terme de recherche
  const filteredStagiaires = stagiairesList.filter(
    (stagiaire) =>
      (stagiaire.firstName &&
        stagiaire.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stagiaire.lastName &&
        stagiaire.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stagiaire.email &&
        stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stagiaire.formation &&
        stagiaire.formation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showAddForm || editingStudent) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingStudent
                  ? "Modifier le Stagiaire"
                  : "Ajouter un Nouveau Stagiaire"}
              </h1>
              <p className="text-gray-600 mt-1">
                {editingStudent
                  ? `Modifiez les informations de ${
                      editingStudent.firstName || ""
                    } ${editingStudent.lastName || ""}`
                  : "Remplissez tous les champs pour créer le profil complet du stagiaire"}
              </p>
            </div>
          </div>

          <AddStudentForm
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            onCancel={handleCancel}
            initialData={editingStudent}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Stagiaires
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredStagiaires.length} stagiaire(s) inscrit(s)
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <User className="mr-2 h-4 w-4" />
            Ajouter un Stagiaire
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input // Utilisation du composant Input de Shadcn UI
                  type="text"
                  placeholder="Rechercher par nom, email ou formation..."
                  className="pl-10 pr-4 py-2" // Ajusté les classes pour correspondre au style Shadcn Input
                  value={searchTerm} // Liaison à l'état searchTerm
                  onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour de l'état searchTerm
                />
              </div>
              {/* Les filtres "Toutes les formations" et "Tous les statuts" ont été supprimés ici */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Liste des Stagiaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStagiaires.length === 0 ? (
                <p className="text-center text-gray-500">
                  Aucun stagiaire trouvé. Ajoutez-en un !
                </p>
              ) : (
                filteredStagiaires.map(
                  (
                    stagiaire // Utilisation de filteredStagiaires
                  ) => (
                    <div
                      key={stagiaire._id}
                      className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors p-4" // Modifié pour permettre le dépliage
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">
                            {stagiaire.firstName} {stagiaire.lastName}
                          </h4>
                          <div className="flex flex-wrap items-center space-x-4 mt-1 text-sm text-gray-500">
                            {stagiaire.email && (
                              <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                {stagiaire.email}
                              </span>
                            )}
                            {stagiaire.phone && (
                              <span className="flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                <strong>Téléphone:</strong> {stagiaire.phone}
                              </span>
                            )}
                            {stagiaire.formation && (
                              <span className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                {stagiaire.formation}
                              </span>
                            )}
                            {stagiaire.positioning && (
                              <span className="flex items-center">
                                <Info className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                <strong>Positionnement:</strong>{" "}
                                {stagiaire.positioning}
                              </span>
                            )}
                            {stagiaire.pathway1 && (
                              <span className="flex items-center">
                                <Info className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                <strong>Parcours 1:</strong>{" "}
                                {stagiaire.pathway1}
                              </span>
                            )}
                            {stagiaire.pathway2 && (
                              <span className="flex items-center">
                                <Info className="h-4 w-4 mr-1 text-muted-foreground" />{" "}
                                <strong>Parcours 2:</strong>{" "}
                                {stagiaire.pathway2}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                          {stagiaire.statut && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                stagiaire.statut === "Actif"
                                  ? "bg-green-100 text-green-700"
                                  : stagiaire.statut === "Diplômé"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {stagiaire.statut}
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDetails(stagiaire._id)} // Bouton "Voir détails"
                          >
                            {expandedStudentId === stagiaire._id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" /> Moins
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" /> Plus
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStudentClick(stagiaire)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteStudent(
                                stagiaire._id,
                                `${stagiaire.firstName} ${stagiaire.lastName}`
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                          </Button>
                        </div>
                      </div>

                      {/* Section des détails supplémentaires (affichage conditionnel) */}
                      {expandedStudentId === stagiaire._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                          {(stagiaire.address ||
                            stagiaire.postalCode ||
                            stagiaire.city) && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Adresse:</strong> {stagiaire.address}
                              {stagiaire.address && ", "}
                              {stagiaire.postalCode}
                              {stagiaire.postalCode && " "}
                              {stagiaire.city}
                            </div>
                          )}
                          {stagiaire.birthDate && (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Date de naissance:</strong>{" "}
                              {stagiaire.birthDate}{" "}
                              {stagiaire.age && `(${stagiaire.age} ans)`}
                            </div>
                          )}
                          {stagiaire.birthCity && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Ville de naissance:</strong>{" "}
                              {stagiaire.birthCity}
                            </div>
                          )}
                          {stagiaire.birthCountry && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Pays de naissance:</strong>{" "}
                              {stagiaire.birthCountry}
                            </div>
                          )}
                          {stagiaire.department && (
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Département:</strong>{" "}
                              {stagiaire.department}
                            </div>
                          )}
                          {stagiaire.educationLevel && (
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Niveau d'études:</strong>{" "}
                              {stagiaire.educationLevel}
                            </div>
                          )}
                          {stagiaire.prescribingOrganization && (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Organisme prescripteur:</strong>{" "}
                              {stagiaire.prescribingOrganization}
                            </div>
                          )}
                          {stagiaire.prescribingCity && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Ville prescripteur:</strong>{" "}
                              {stagiaire.prescribingCity}
                            </div>
                          )}
                          {stagiaire.infoCollectiveDate && (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Date info collective:</strong>{" "}
                              {stagiaire.infoCollectiveDate}
                            </div>
                          )}
                          {typeof stagiaire.presentAtInfoCollective ===
                            "boolean" && (
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Présent info collective:</strong>{" "}
                              {stagiaire.presentAtInfoCollective
                                ? "Oui"
                                : "Non"}
                            </div>
                          )}
                          {typeof stagiaire.presentAtIndividualInterview ===
                            "boolean" && (
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Présent entretien ind.:</strong>{" "}
                              {stagiaire.presentAtIndividualInterview
                                ? "Oui"
                                : "Non"}
                            </div>
                          )}
                          {stagiaire.centerDecision && (
                            <div className="col-span-full">
                              <strong className="flex items-center mb-1">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                Décision du centre:
                              </strong>
                              <p className="ml-6 text-gray-600">
                                {stagiaire.centerDecision}
                              </p>
                            </div>
                          )}
                          {stagiaire.result && (
                            <div className="flex items-center col-span-full">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <strong>Résultat:</strong> {stagiaire.result}
                            </div>
                          )}
                          {stagiaire.candidateInformation && (
                            <div className="col-span-full">
                              <strong className="flex items-center mb-1">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                Info Candidat/Conseiller:
                              </strong>
                              <p className="ml-6 text-gray-600">
                                {stagiaire.candidateInformation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;
