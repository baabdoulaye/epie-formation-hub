// frontend/src/pages/Partners.tsx
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

// Utilisation de la variable d'environnement pour l'URL de base
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
      // Utilisation de API_BASE_URL + /api/partners
      const response = await axios.get(`${API_BASE_URL}/api/partners`);
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
      // Utilisation de API_BASE_URL + /api/partners
      const response = await axios.post(`${API_BASE_URL}/api/partners`, data);
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
        `${API_BASE_URL}/api/partners/${editingPartner._id}`, // Utilisation de API_BASE_URL
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
      await axios.delete(`${API_BASE_URL}/api/partners/${partnerId}`); // Utilisation de API_BASE_URL
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
                Remplissez les informations du nouveau partenaire.
              </p>
            </div>
          </div>

          <AddPartnerForm
            onSubmit={handleAddPartner}
            onCancel={handleCancelAdd}
            initialData={null}
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
                Modifiez les informations du partenaire existant.
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Partenaires
            </h1>
            <p className="text-gray-600 mt-1">
              {partners.length} partenaire(s) enregistré(s)
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

        <Card>
          <CardContent className="p-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, type ou secteur d'activité..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span>Liste des Partenaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500">
                Chargement des partenaires...
              </p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredPartners.length === 0 ? (
              <p className="text-center text-gray-500">
                Aucun partenaire trouvé. Ajoutez-en un !
              </p>
            ) : (
              <div className="space-y-4">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 space-y-1 sm:space-y-0">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {partner.nom}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnerTypeColor(
                            partner.typePartenaire
                          )}`}
                        >
                          {partner.typePartenaire}
                        </span>
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1 text-sm text-gray-500">
                        <span>
                          <MapPin className="inline h-4 w-4 mr-1 text-gray-400" />
                          {partner.ville}, {partner.codePostal}
                        </span>
                        <span>
                          <Building2 className="inline h-4 w-4 mr-1 text-gray-400" />
                          {partner.secteurActivite}
                        </span>
                        {partner.siteWeb && (
                          <a
                            href={partner.siteWeb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-4 w-4" /> Site Web
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPartner(partner)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePartner(partner._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Partners;
