import React, { useState, useEffect } from "react"; // Ajout de useEffect
import Layout from "@/components/layout/Layout";
import AddPartnerForm from "@/components/partners/AddPartnerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios"; // Import de axios

interface Partner {
  _id: string; // Utilise _id pour correspondre à MongoDB
  nom: string;
  typePartenaire: string;
  secteurActivite: string;
  ville: string;
  codePostal: string;
  siteWeb?: string;
  description?: string;
  createdAt: string; // Utilise createdAt pour correspondre à MongoDB
}

const API_BASE_URL = "http://localhost:5000/api"; // URL de base de ton API backend

const Partners: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]); // Initialise avec un tableau vide
  const { toast } = useToast();
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur

  // --- Fonction pour récupérer les partenaires depuis l'API ---
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/partners`);
      setPartners(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des partenaires :", err);
      setError("Impossible de charger les partenaires. Veuillez réessayer.");
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Appel de la fonction fetchPartners au montage du composant ---
  useEffect(() => {
    fetchPartners();
  }, []); // Le tableau vide [] assure que cela ne s'exécute qu'une seule fois au montage

  const filteredPartners = partners.filter(
    (partner) =>
      partner.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.typePartenaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Gestion de l'ajout d'un partenaire avec appel API ---
  const handleAddPartner = async (data: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/partners`, data);
      setPartners([...partners, response.data]); // Ajoute le partenaire retourné par l'API (avec son _id)

      toast({
        title: "Partenaire ajouté avec succès",
        description: `${data.nom} a été ajouté à la liste des partenaires.`,
      });

      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout du partenaire :", err);
      toast({
        title: "Erreur d'ajout",
        description:
          "Impossible d'ajouter le partenaire. Vérifiez les informations.",
        variant: "destructive",
      });
    }
  };

  // --- Gestion de la modification d'un partenaire avec appel API ---
  const handleEditPartner = async (data: any) => {
    if (!editingPartner) return;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/partners/${editingPartner._id}`,
        data
      );
      setPartners(
        partners.map((partner) =>
          partner._id === editingPartner._id
            ? response.data // Remplace par les données mises à jour retournées par l'API
            : partner
        )
      );

      toast({
        title: "Partenaire modifié avec succès",
        description: `${data.nom} a été mis à jour.`,
      });

      setEditingPartner(null);
    } catch (err) {
      console.error("Erreur lors de la modification du partenaire :", err);
      toast({
        title: "Erreur de modification",
        description: "Impossible de modifier le partenaire.",
        variant: "destructive",
      });
    }
  };

  // --- Gestion de la suppression d'un partenaire avec appel API ---
  const handleDeletePartner = async (partnerId: string) => {
    const partnerToDelete = partners.find((p) => p._id === partnerId);
    if (!partnerToDelete) return;

    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le partenaire ${partnerToDelete.nom} ?`
      )
    ) {
      return; // Annule la suppression si l'utilisateur annule la confirmation
    }

    try {
      await axios.delete(`${API_BASE_URL}/partners/${partnerId}`);
      setPartners(partners.filter((partner) => partner._id !== partnerId)); // Filtre localement après succès API

      toast({
        title: "Partenaire supprimé",
        description: `${partnerToDelete.nom} a été supprimé de la liste.`,
      });
    } catch (err) {
      console.error("Erreur lors de la suppression du partenaire :", err);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      });
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingPartner(null);
  };

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case "Institutionnel":
        return "bg-blue-100 text-blue-700";
      case "Collectivité":
        return "bg-green-100 text-green-700";
      case "Entreprise":
        return "bg-purple-100 text-purple-700";
      case "Association":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
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
              <span>Retour à la liste</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un Nouveau Partenaire
              </h1>
              <p className="text-gray-600 mt-1">
                Remplissez les informations du nouveau partenaire
              </p>
            </div>
          </div>

          <AddPartnerForm
            onSubmit={handleAddPartner}
            onCancel={handleCancelAdd}
          />
        </div>
      </Layout>
    );
  }

  if (editingPartner) {
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
              <span>Retour à la liste</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier le Partenaire
              </h1>
              <p className="text-gray-600 mt-1">
                Modifiez les informations de {editingPartner.nom}
              </p>
            </div>
          </div>

          <AddPartnerForm
            onSubmit={handleEditPartner}
            onCancel={handleCancelEdit}
            initialData={editingPartner}
          />
        </div>
      </Layout>
    );
  }

  // Ajout d'un affichage de chargement/erreur
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-700">Chargement des partenaires...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 flex-col">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPartners}>Réessayer</Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Partenaires</h1>
            <p className="text-gray-600 mt-1">
              {filteredPartners.length} partenaires
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Partenaire
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, type ou secteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des partenaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => (
            <Card
              key={partner._id}
              className="hover:shadow-lg transition-shadow"
            >
              {" "}
              {/* Utilise _id comme clé */}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{partner.nom}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnerTypeColor(
                            partner.typePartenaire
                          )}`}
                        >
                          {partner.typePartenaire}
                        </span>
                        <span className="text-sm text-gray-500">
                          {partner.secteurActivite}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {partner.ville} {partner.codePostal}
                    </span>
                  </div>

                  {partner.siteWeb && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a
                        href={partner.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        Site web
                      </a>
                    </div>
                  )}

                  {partner.description && (
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                      {partner.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      Ajouté le{" "}
                      {new Date(partner.createdAt).toLocaleDateString("fr-FR")}{" "}
                      {/* Utilise createdAt */}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPartner(partner)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePartner(partner._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun partenaire trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Aucun partenaire ne correspond à votre recherche."
                  : "Commencez par ajouter votre premier partenaire."}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Partenaire
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Partners;
