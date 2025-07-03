// frontend/src/pages/Students.tsx
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import AddStudentForm from "@/components/students/AddStudentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Importe l'icône 'Trash2' de lucide-react pour le bouton de suppression
import { Users, Search, User, ArrowLeft, Edit, Trash2 } from "lucide-react";
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
  formation?: string;
  statut?: string;
}

const Students: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const { toast } = useToast();
  const [stagiairesList, setStagiairesList] = useState<Stagiaire[]>([]);

  const fetchStagiaires = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stagiaires");
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
        "http://localhost:5000/api/stagiaires",
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

      fetchStagiaires();
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
        `http://localhost:5000/api/stagiaires/${data._id}`,
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

      fetchStagiaires();
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

  // NOUVELLE FONCTION POUR GÉRER LA SUPPRESSION
  const handleDeleteStudent = async (
    stagiaireId: string,
    studentName: string
  ) => {
    if (
      !window.confirm(
        `Es-tu sûr de vouloir supprimer le stagiaire "${studentName}" ? Cette action est irréversible.`
      )
    ) {
      return; // Annule la suppression si l'utilisateur annule la confirmation
    }

    try {
      await axios.delete(`http://localhost:5000/api/stagiaires/${stagiaireId}`);
      toast({
        title: "Stagiaire supprimé avec succès",
        description: `${studentName} a été retiré de la base de données.`,
      });
      // Rafraîchir la liste des stagiaires après la suppression
      fetchStagiaires();
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
    const mappedData = {
      _id: stagiaire._id,
      prenom: stagiaire.firstName,
      nom: stagiaire.lastName,
      email: stagiaire.email,
      phone: stagiaire.phone,
      birthDate: stagiaire.birthDate,
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
                      editingStudent.prenom || ""
                    } ${editingStudent.nom || ""}`
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
              {stagiairesList.length} stagiaire(s) inscrit(s)
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
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou formation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Toutes les formations</option>
                  <option>Formations Numériques</option>
                  <option>Socles de Compétences</option>
                  <option>Formations Linguistiques</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les statuts</option>
                  <option>Actif</option>
                  <option>Diplômé</option>
                  <option>Abandonné</option>
                </select>
              </div>
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
              {stagiairesList.length === 0 ? (
                <p className="text-center text-gray-500">
                  Aucun stagiaire trouvé. Ajoutez-en un !
                </p>
              ) : (
                stagiairesList.map((stagiaire) => (
                  <div
                    key={stagiaire._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {stagiaire.firstName} {stagiaire.lastName}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        {stagiaire.formation && (
                          <span>📚 {stagiaire.formation}</span>
                        )}
                        {stagiaire.email && <span>📧 {stagiaire.email}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stagiaire.statut === "Actif"
                            ? "bg-green-100 text-green-700"
                            : stagiaire.statut === "Diplômé"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {stagiaire.statut || "N/A"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStudentClick(stagiaire)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      {/* NOUVEAU BOUTON DE SUPPRESSION */}
                      <Button
                        variant="destructive" // Utilise la variante 'destructive' pour un bouton rouge
                        size="sm"
                        onClick={() =>
                          handleDeleteStudent(
                            stagiaire._id,
                            `${stagiaire.firstName} ${stagiaire.lastName}`
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1" />{" "}
                        {/* Icône de poubelle */}
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;
