// frontend/src/pages/Trainings.tsx

import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Calendar, FileText, Edit, Trash2 } from "lucide-react";
import AddTrainingForm from "@/components/forms/AddTrainingForm";
import { useToast } from "@/hooks/use-toast";

/**
 * Page Trainings - Gestion des formations
 */
const Trainings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any | null>(null); // NOUVEL ÉTAT : Pour stocker la formation en cours d'édition
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFormations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/formations`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      const data = await response.json();
      setFormations(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Échec du chargement des formations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const handleScheduleSession = () => {
    toast({
      title: "Planifier une Session",
      description: "Fonctionnalité en cours de développement",
    });
  };

  // Cette fonction est appelée après la création OU la modification réussie
  const handleFormSubmitSuccess = () => {
    toast({
      title: editingTraining ? "Formation modifiée" : "Formation créée", // Message adapté
      description: `La formation a été ${
        editingTraining ? "modifiée" : "ajoutée"
      } avec succès et la liste est mise à jour.`,
    });
    fetchFormations(); // Re-déclenche le chargement pour rafraîchir la liste
    setShowForm(false); // Cache le formulaire
    setEditingTraining(null); // Réinitialise la formation en cours d'édition
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/formations/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP lors de la suppression! statut: ${response.status}`
          );
        }

        toast({
          title: "Formation supprimée",
          description: "La formation a été supprimée avec succès.",
          variant: "destructive",
        });
        fetchFormations(); // Recharger la liste
      } catch (err: any) {
        toast({
          title: "Erreur de suppression",
          description: `Impossible de supprimer la formation: ${err.message}`,
          variant: "destructive",
        });
        console.error("Échec de la suppression de la formation:", err);
      }
    }
  };

  // MODIFICATION : Au clic sur "Modifier", on stocke la formation à éditer et on ouvre le formulaire
  const handleEdit = (formationToEdit: any) => {
    setEditingTraining(formationToEdit); // Stocke la formation à éditer
    setShowForm(true); // Ouvre le formulaire
  };

  // Rendu conditionnel : soit le formulaire (création ou édition), soit la page de gestion
  if (showForm) {
    return (
      <Layout>
        <AddTrainingForm
          onBack={() => {
            setShowForm(false);
            setEditingTraining(null); // S'assurer de réinitialiser si l'utilisateur annule
          }}
          onSuccess={handleFormSubmitSuccess}
          initialData={editingTraining} // NOUVEAU : Passe les données initiales au formulaire
        />
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
              Gestion des Formations
            </h1>
            <p className="text-gray-600 mt-1">
              {formations.length} formations disponibles • 8 sessions actives
            </p>
          </div>
          <Button
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => {
              setEditingTraining(null); // S'assurer qu'on est en mode création
              setShowForm(true);
            }}
          >
            <File className="mr-2 h-4 w-4" />
            Créer une Formation
          </Button>
        </div>

        {/* Statistiques rapides (compteurs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formations Numériques</p>
                  <p className="text-xl font-semibold">
                    {
                      formations.filter(
                        (f) => f.categorie === "Formations Numériques"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Socles de Compétences</p>
                  <p className="text-xl font-semibold">
                    {
                      formations.filter(
                        (f) => f.categorie === "Socles de Compétences"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Formations Linguistiques
                  </p>
                  <p className="text-xl font-semibold">
                    {
                      formations.filter(
                        (f) => f.categorie === "Formations Linguistiques"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex space-x-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Toutes les catégories</option>
                  <option>Formations Numériques</option>
                  <option>Socles de Compétences</option>
                  <option>Formations Linguistiques</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Tous les statuts</option>
                  <option>Active</option>
                  <option>Planifiée</option>
                  <option>Terminée</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Affichage conditionnel des formations ou du message "Catalogue des Formations" */}
        {loading && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600">Chargement des formations...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-red-500">Erreur lors du chargement: {error}</p>
              <p className="text-gray-600 mt-2">
                Veuillez vérifier votre connexion au backend ou réessayer plus
                tard.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            {formations.length === 0 ? (
              // Message et boutons si aucune formation n'est disponible (ton design d'origine)
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Catalogue des Formations EPIE
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Gérez ici toutes les formations proposées par EPIE
                    Formation. Créez de nouvelles formations, planifiez des
                    sessions et suivez les inscriptions.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={handleScheduleSession}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Planifier une Session
                    </Button>
                    <Button
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => {
                        setEditingTraining(null); // S'assurer qu'on est en mode création
                        setShowForm(true);
                      }}
                    >
                      <File className="mr-2 h-4 w-4" />
                      Nouvelle Formation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Affichage des cartes de formation si des formations sont trouvées
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                  <Card key={formation._id}>
                    <CardContent className="p-4">
                      {/* Ton contenu de carte de formation original */}
                      <p className="text-sm text-gray-600">
                        Catégorie: {formation.categorie}
                      </p>
                      <h3 className="font-bold text-lg mt-1 mb-2">
                        {formation.titre}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {formation.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Durée: {formation.duree} heures
                      </p>

                      {/* Boutons Modifier et Supprimer */}
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(formation)} // Passe l'objet formation complet au clic
                        >
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(formation._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Trainings;
