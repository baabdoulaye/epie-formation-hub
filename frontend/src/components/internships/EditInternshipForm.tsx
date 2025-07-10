// frontend/src/components/internships/EditInternshipForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Building,
  User, // Garde l'icône User
  Mail,
  Phone,
  Save,
  X,
  Info,
} from "lucide-react";

// Définition locale du type Internship (alignée avec le backend après suppressions)
// Assure-toi que cette définition correspond à la réalité de ton modèle Stage dans le backend !
type Internship = {
  student_name: string; // NOUVEAU : Ajout de student_name
  entreprise: string;
  tuteur_entreprise: string;
  email_tuteur: string;
  telephone_tuteur: string;
  date_debut: string;
  date_fin: string;
  objectifs: string;
  statut: "En cours" | "Terminé" | "Annulé";
  commentaires?: string;
};

// Schéma de validation Zod pour la modification d'un stage
// Tous les champs sont désormais optionnels pour être cohérents avec AddInternshipForm
const internshipSchema = z.object({
  student_name: z.string().min(1, "Le nom du stagiaire est requis.").optional(), // NOUVEAU : student_name est requis mais peut être optionnel pour la mise à jour partielle
  entreprise: z.string().optional(),
  tuteur_entreprise: z.string().optional(),
  email_tuteur: z
    .string()
    .email("Format d'email invalide")
    .or(z.literal(""))
    .optional(),
  telephone_tuteur: z.string().optional(),
  date_debut: z.string().optional(),
  date_fin: z.string().optional(),
  objectifs: z.string().optional(),
  statut: z.enum(["En cours", "Terminé", "Annulé"]).optional(),
  commentaires: z.string().optional(),
});

type InternshipFormData = z.infer<typeof internshipSchema>;

interface EditInternshipFormProps {
  internship: Internship; // Renommé 'session' en 'internship' pour plus de clarté
  onSubmit: (data: InternshipFormData) => void;
  onCancel: () => void;
}

const EditInternshipForm: React.FC<EditInternshipFormProps> = ({
  internship,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      // Les valeurs par défaut seront chargées depuis l'objet internship passé en prop
    },
  });

  useEffect(() => {
    // Remplir le formulaire avec les données du stage à modifier
    if (internship) {
      reset({
        student_name: internship.student_name, // NOUVEAU : Initialisation de student_name
        entreprise: internship.entreprise,
        tuteur_entreprise: internship.tuteur_entreprise,
        email_tuteur: internship.email_tuteur,
        telephone_tuteur: internship.telephone_tuteur,
        date_debut: new Date(internship.date_debut).toISOString().split("T")[0],
        date_fin: new Date(internship.date_fin).toISOString().split("T")[0],
        objectifs: internship.objectifs,
        statut: internship.statut,
        commentaires: internship.commentaires,
      });
    }
  }, [internship, reset]);

  const handleFormSubmit = (data: InternshipFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Modifier le Stage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nouveau champ: Nom du stagiaire */}
          <div className="space-y-2">
            <Label
              htmlFor="student_name"
              className="flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span>Nom du Stagiaire</span>{" "}
              {/* Retiré l'astérisque car non obligatoire pour la modification */}
            </Label>
            <Input
              id="student_name"
              {...register("student_name")}
              placeholder="Ex: Jean Dupont"
            />
            {errors.student_name && (
              <p className="text-sm text-red-600">
                {errors.student_name.message}
              </p>
            )}
          </div>

          {/* Informations sur l'entreprise */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="entreprise"
                className="flex items-center space-x-1"
              >
                <Building className="h-4 w-4" />
                <span>Entreprise</span>
              </Label>
              <Input
                id="entreprise"
                {...register("entreprise")}
                placeholder="Ex: Digital Solutions SARL"
              />
              {errors.entreprise && (
                <p className="text-sm text-red-600">
                  {errors.entreprise.message}
                </p>
              )}
            </div>
          </div>

          {/* Informations sur le tuteur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="tuteur_entreprise"
                className="flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Tuteur Entreprise</span>
              </Label>
              <Input
                id="tuteur_entreprise"
                {...register("tuteur_entreprise")}
                placeholder="Ex: Jane Doe"
              />
              {errors.tuteur_entreprise && (
                <p className="text-sm text-red-600">
                  {errors.tuteur_entreprise.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email_tuteur"
                className="flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span>Email Tuteur</span>
              </Label>
              <Input
                id="email_tuteur"
                type="email"
                {...register("email_tuteur")}
                placeholder="Ex: jane.doe@entreprise.com"
              />
              {errors.email_tuteur && (
                <p className="text-sm text-red-600">
                  {errors.email_tuteur.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="telephone_tuteur"
                className="flex items-center space-x-1"
              >
                <Phone className="h-4 w-4" />
                <span>Téléphone Tuteur</span>
              </Label>
              <Input
                id="telephone_tuteur"
                type="tel"
                {...register("telephone_tuteur")}
                placeholder="Ex: 0123456789"
              />
              {errors.telephone_tuteur && (
                <p className="text-sm text-red-600">
                  {errors.telephone_tuteur.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date_debut">Date de Début</Label>
              <Input id="date_debut" type="date" {...register("date_debut")} />
              {errors.date_debut && (
                <p className="text-sm text-red-600">
                  {errors.date_debut.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_fin">Date de Fin</Label>
              <Input id="date_fin" type="date" {...register("date_fin")} />
              {errors.date_fin && (
                <p className="text-sm text-red-600">
                  {errors.date_fin.message}
                </p>
              )}
            </div>
          </div>

          {/* Objectifs */}
          <div className="space-y-2">
            <Label htmlFor="objectifs">Objectifs du Stage</Label>
            <Textarea
              id="objectifs"
              {...register("objectifs")}
              placeholder="Ex: Apprendre les bases du développement web, maîtriser React et Node.js"
              rows={3}
            />
            {errors.objectifs && (
              <p className="text-sm text-red-600">{errors.objectifs.message}</p>
            )}
          </div>

          {/* Statut et Commentaires */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="statut" className="flex items-center space-x-1">
                <Info className="h-4 w-4" />
                <span>Statut</span>
              </Label>
              <select
                id="statut"
                {...register("statut")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
              {errors.statut && (
                <p className="text-sm text-red-600">{errors.statut.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="commentaires">Commentaires (optionnels)</Label>
            <Textarea
              id="commentaires"
              {...register("commentaires")}
              placeholder="Commentaires sur le stage, points forts, points à améliorer..."
              rows={3}
            />
            {errors.commentaires && (
              <p className="text-sm text-red-600">
                {errors.commentaires.message}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSubmitting ? "Mise à jour..." : "Modifier le Stage"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditInternshipForm;
