import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X, Building, UserCheck, Calendar, User } from "lucide-react"; // Ajout de l'icône User

/**
 * Interface pour les données du formulaire de stage, alignée avec le modèle Stage du backend.
 */
export type InternshipFormData = {
  student_name: string; // NOUVEAU : Le nom du stagiaire est maintenant requis
  entreprise?: string;
  tuteur_entreprise?: string; // Le nom du tuteur de l'entreprise
  email_tuteur?: string;
  telephone_tuteur?: string;
  date_debut?: string; // Format YYYY-MM-DD
  date_fin?: string; // Format YYYY-MM-DD
  objectifs?: string;
  statut?: "En cours" | "Terminé" | "Annulé";
  commentaires?: string;
};

/**
 * Schéma de validation Zod pour le formulaire de stage.
 */
const internshipSchema = z.object({
  student_name: z.string().min(1, "Le nom du stagiaire est requis."), // NOUVEAU : Validation pour le nom du stagiaire
  entreprise: z.string().optional(),
  tuteur_entreprise: z.string().optional(),
  email_tuteur: z
    .string()
    .email("Format d'email invalide")
    .or(z.literal(""))
    .optional(), // Permet chaîne vide ou email valide
  telephone_tuteur: z.string().optional(),
  date_debut: z.string().optional(),
  date_fin: z.string().optional(),
  objectifs: z.string().optional(),
  statut: z.enum(["En cours", "Terminé", "Annulé"]).optional(),
  commentaires: z.string().optional(),
});

/**
 * Interface pour les props du composant
 */
interface AddInternshipFormProps {
  onSubmit: (data: InternshipFormData) => void;
  onCancel: () => void;
}

/**
 * Composant AddInternshipForm - Formulaire d'ajout de stage
 *
 * Permet la saisie complète des informations d'un stage
 * avec validation des données et interface intuitive
 */
const AddInternshipForm: React.FC<AddInternshipFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      student_name: "", // NOUVEAU : Valeur par défaut
      entreprise: "",
      tuteur_entreprise: "",
      email_tuteur: "",
      telephone_tuteur: "",
      date_debut: "",
      date_fin: "",
      objectifs: "",
      statut: "En cours", // Valeur par défaut pour le statut
      commentaires: "",
    },
  });

  /**
   * Gestion de la soumission du formulaire
   */
  const onFormSubmit = (data: InternshipFormData) => {
    console.log("Données du stage:", data); // `cleanedData` n'est plus nécessaire avec Zod et Object.assign au backend
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Section Informations du Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Informations Générales du Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* NOUVEAU CHAMP : Nom du Stagiaire */}
            <div>
              <Label htmlFor="student_name">Nom du Stagiaire</Label>
              <Input
                {...register("student_name")}
                placeholder="Nom complet du stagiaire"
                className="mt-1"
              />
              {errors.student_name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.student_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entreprise">Nom de l'Entreprise</Label>
                <Input
                  {...register("entreprise")}
                  placeholder="Nom de l'entreprise"
                  className="mt-1"
                />
                {errors.entreprise && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.entreprise.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tuteur_entreprise">
                  Nom du Tuteur d'Entreprise
                </Label>
                <Input
                  {...register("tuteur_entreprise")}
                  placeholder="Nom complet du tuteur"
                  className="mt-1"
                />
                {errors.tuteur_entreprise && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.tuteur_entreprise.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email_tuteur">Email Tuteur</Label>
                <Input
                  type="email"
                  {...register("email_tuteur")}
                  placeholder="tuteur@entreprise.com"
                  className="mt-1"
                />
                {errors.email_tuteur && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email_tuteur.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="telephone_tuteur">Téléphone Tuteur</Label>
                <Input
                  {...register("telephone_tuteur")}
                  placeholder="01 23 45 67 89"
                  className="mt-1"
                />
                {errors.telephone_tuteur && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.telephone_tuteur.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_debut">Date de Début</Label>
                <Input
                  type="date"
                  {...register("date_debut")}
                  className="mt-1"
                />
                {errors.date_debut && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.date_debut.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="date_fin">Date de Fin</Label>
                <Input type="date" {...register("date_fin")} className="mt-1" />
                {errors.date_fin && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.date_fin.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="objectifs">Objectifs du Stage</Label>
              <Textarea
                {...register("objectifs")}
                placeholder="Décrivez les objectifs du stage..."
                className="mt-1"
                rows={3}
              />
              {errors.objectifs && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.objectifs.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="statut">Statut du Stage</Label>
              <select
                {...register("statut")}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
              {errors.statut && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.statut.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="commentaires">Commentaires</Label>
              <Textarea
                {...register("commentaires")}
                placeholder="Commentaires généraux sur le stage..."
                className="mt-1"
                rows={3}
              />
              {errors.commentaires && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.commentaires.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer le Stage"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddInternshipForm;
