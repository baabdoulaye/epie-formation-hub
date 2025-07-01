// frontend/src/components/forms/AddTrainingForm.tsx

import React, { useState, useEffect } from "react"; // Ajout de useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTrainingFormProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: any; // NOUVEAU : Prop optionnelle pour les données initiales de la formation (pour la modification)
}

const AddTrainingForm: React.FC<AddTrainingFormProps> = ({
  onBack,
  onSuccess,
  initialData,
}) => {
  // Initialise les états du formulaire avec les données initiales si elles existent
  const [titre, setTitre] = useState(initialData?.titre || "");
  const [categorie, setCategorie] = useState(initialData?.categorie || "");
  const [duree, setDuree] = useState(initialData?.duree || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission
  const { toast } = useToast();

  // Si initialData change (ex: on clique sur modifier une autre formation), met à jour les états du formulaire
  useEffect(() => {
    if (initialData) {
      setTitre(initialData.titre || "");
      setCategorie(initialData.categorie || "");
      setDuree(initialData.duree || "");
      setDescription(initialData.description || "");
    } else {
      // Réinitialise le formulaire si initialData est null (mode création)
      setTitre("");
      setCategorie("");
      setDuree("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trainingData = {
      titre,
      categorie,
      duree: Number(duree), // Assurez-vous que la durée est un nombre
      description,
    };

    try {
      const url = initialData
        ? `${import.meta.env.VITE_BACKEND_URL}/api/formations/${
            initialData._id
          }` // URL pour la modification (PUT)
        : `${import.meta.env.VITE_BACKEND_URL}/api/formations`; // URL pour la création (POST)

      const method = initialData ? "PUT" : "POST"; // Méthode HTTP (PUT ou POST)

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        // Tente de lire le message d'erreur du backend
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erreur inconnue" }));
        throw new Error(
          errorData.message || `Erreur HTTP! statut: ${response.status}`
        );
      }

      onSuccess(); // Appelle la fonction de succès passée par le parent (pour rafraîchir la liste)
    } catch (err: any) {
      toast({
        title: "Erreur de soumission",
        description: `Impossible de sauvegarder la formation: ${err.message}`,
        variant: "destructive",
      });
      console.error("Échec de la soumission du formulaire:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold">
          {initialData
            ? "Modifier la Formation"
            : "Créer une Nouvelle Formation"}{" "}
          {/* Titre dynamique */}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <div>
          <Label htmlFor="titre">Titre de la formation</Label>
          <Input
            id="titre"
            placeholder="Nom de la formation"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="categorie">Catégorie</Label>
          <Select value={categorie} onValueChange={setCategorie} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formations Numériques">
                Formations Numériques
              </SelectItem>
              <SelectItem value="Socles de Compétences">
                Socles de Compétences
              </SelectItem>
              <SelectItem value="Formations Linguistiques">
                Formations Linguistiques
              </SelectItem>
              {/* Ajoute d'autres catégories si nécessaire */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duree">Durée (en heures)</Label>
          <Input
            id="duree"
            type="number"
            placeholder="Durée en heures"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description de la formation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Sauvegarde en cours..."
              : initialData
              ? "Modifier la Formation"
              : "Créer la Formation"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTrainingForm;
