// frontend/src/components/internships/AddInternshipForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Save,
  X,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Tag, // Ajout de l'icône Tag pour le secteur
  BookOpen, // NOUVEAU: Icône pour la formation
} from "lucide-react";

// Définition des options de secteur (doit correspondre à l'enum du backend)
const SECTEUR_OPTIONS = [
  "", // Option vide pour "Sélectionner un secteur"
  "Technologie",
  "Services",
  "Commerce",
  "Industrie",
  "Santé",
  "Finance",
  "Construction",
];

// NOUVEAU: Définition des options de formation
const FORMATION_OPTIONS = [
  "", // Option vide pour "Sélectionner une formation"
  "Parcours Sécurisé vers les métiers de l’informatique et du numérique",
  "Parcours d’Accès à la Qualification aux métiers de l’informatique et du numérique",
  "TP – Technicien(ne) Supérieur Système et Réseaux",
  "TP – Technicien(ne) Informatique de Proximité",
  "TP – Technicien(ne) Réseaux IP",
  "DéClics Numériques",
  "Parcours Sécurisé vers les métiers de l’Accueil et du Secrétariat",
  "CléA",
];

/**
 * Interface pour les données du formulaire de stage, alignée avec le modèle Stage du backend.
 */
export type InternshipFormData = {
  student_name: string;
  student_adresse?: string;
  student_telephone?: string;
  student_email?: string;
  formation_suivie?: string; // NOUVEAU: Champ formation_suivie

  entreprise: string; // Rendu requis
  entreprise_adresse?: string;
  entreprise_ville?: string;
  entreprise_code_postal?: string;
  secteur?: string;

  tuteur_entreprise?: string;
  email_tuteur?: string;
  telephone_tuteur?: string;
  date_debut: string; // Format YYYY-MM-DD, requis
  date_fin: string; // Format YYYY-MM-DD, requis
  objectifs?: string;
  competences_visees?: string[];
  evaluation?: number | null;
  commentaires?: string;
};

/**
 * Schéma de validation Zod pour le formulaire de stage.
 */
const internshipSchema = z
  .object({
    student_name: z.string().min(1, "Le nom du stagiaire est requis."),
    student_adresse: z.string().optional(),
    student_telephone: z.string().optional(),
    student_email: z
      .string()
      .email("Format d'email invalide")
      .or(z.literal(""))
      .optional(),
    formation_suivie: z // NOUVEAU: Validation de la formation
      .enum(FORMATION_OPTIONS as [string, ...string[]], {
        errorMap: (issue, ctx) => {
          if (issue.code === z.ZodIssueCode.invalid_enum_value) {
            return { message: "Veuillez sélectionner une formation valide." };
          }
          return { message: ctx.defaultError };
        },
      })
      .optional(),

    entreprise: z.string().min(1, "Le nom de l'entreprise est requis."),
    entreprise_adresse: z.string().optional(),
    entreprise_ville: z.string().optional(),
    entreprise_code_postal: z.string().optional(),
    secteur: z
      .enum(SECTEUR_OPTIONS as [string, ...string[]], {
        errorMap: (issue, ctx) => {
          if (issue.code === z.ZodIssueCode.invalid_enum_value) {
            return { message: "Veuillez sélectionner un secteur valide." };
          }
          return { message: ctx.defaultError };
        },
      })
      .optional(),

    tuteur_entreprise: z.string().optional(),
    email_tuteur: z
      .string()
      .email("Format d'email invalide")
      .or(z.literal(""))
      .optional(),
    telephone_tuteur: z.string().optional(),
    date_debut: z.string().min(1, "La date de début est requise."),
    date_fin: z.string().min(1, "La date de fin est requise."),
    objectifs: z.string().optional(),
    competences_visees: z.array(z.string()).optional(),
    evaluation: z.number().nullable().optional(),
    commentaires: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.date_debut && data.date_fin) {
        return new Date(data.date_fin) >= new Date(data.date_debut);
      }
      return true;
    },
    {
      message: "La date de fin ne peut pas être antérieure à la date de début.",
      path: ["date_fin"],
    }
  );

interface AddInternshipFormProps {
  onSubmit: (data: InternshipFormData) => void;
  onCancel: () => void;
}

const AddInternshipForm: React.FC<AddInternshipFormProps> = ({
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
      student_name: "",
      student_adresse: "",
      student_telephone: "",
      student_email: "",
      formation_suivie: "", // NOUVEAU: Valeur par défaut pour la formation
      entreprise: "",
      entreprise_adresse: "",
      entreprise_ville: "",
      entreprise_code_postal: "",
      secteur: "",
      tuteur_entreprise: "",
      email_tuteur: "",
      telephone_tuteur: "",
      date_debut: "",
      date_fin: "",
      objectifs: "",
      competences_visees: [],
      evaluation: null,
      commentaires: "",
    },
  });

  const onFormSubmit = (data: InternshipFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Section Informations Stagiaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Informations du Stagiaire</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div>
              <Label htmlFor="student_adresse">Adresse du Stagiaire</Label>
              <Input
                {...register("student_adresse")}
                placeholder="Ex: 123 Rue de l'Apprentissage"
                className="mt-1"
              />
              {errors.student_adresse && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.student_adresse.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_telephone">
                  Téléphone du Stagiaire
                </Label>
                <Input
                  {...register("student_telephone")}
                  placeholder="Ex: 06 12 34 56 78"
                  className="mt-1"
                />
                {errors.student_telephone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.student_telephone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="student_email">Email du Stagiaire</Label>
                <Input
                  type="email"
                  {...register("student_email")}
                  placeholder="Ex: stagiaire@email.com"
                  className="mt-1"
                />
                {errors.student_email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.student_email.message}
                  </p>
                )}
              </div>
            </div>
            {/* NOUVEAU: Champ Formation suivie */}
            <div>
              <Label
                htmlFor="formation_suivie"
                className="flex items-center space-x-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>Formation Suivie</span>
              </Label>
              <select
                id="formation_suivie"
                {...register("formation_suivie")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              >
                {FORMATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "" ? "Sélectionner une formation" : option}
                  </option>
                ))}
              </select>
              {errors.formation_suivie && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.formation_suivie.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Informations Entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span>Informations de l'Entreprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="entreprise_adresse">
                Adresse de l'Entreprise
              </Label>
              <Input
                {...register("entreprise_adresse")}
                placeholder="Ex: 456 Avenue des Technologies"
                className="mt-1"
              />
              {errors.entreprise_adresse && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.entreprise_adresse.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entreprise_ville">Ville de l'Entreprise</Label>
                <Input
                  {...register("entreprise_ville")}
                  placeholder="Ex: Paris"
                  className="mt-1"
                />
                {errors.entreprise_ville && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.entreprise_ville.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="entreprise_code_postal">
                  Code Postal de l'Entreprise
                </Label>
                <Input
                  {...register("entreprise_code_postal")}
                  placeholder="Ex: 75001"
                  className="mt-1"
                />
                {errors.entreprise_code_postal && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.entreprise_code_postal.message}
                  </p>
                )}
              </div>
            </div>
            {/* Champ Secteur */}
            <div>
              <Label htmlFor="secteur" className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>Secteur d'Activité</span>
              </Label>
              <select
                id="secteur"
                {...register("secteur")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              >
                {SECTEUR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "" ? "Sélectionner un secteur" : option}
                  </option>
                ))}
              </select>
              {errors.secteur && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.secteur.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Informations Tuteur d'Entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Informations du Tuteur d'Entreprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Section Dates et Objectifs du Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Dates et Objectifs du Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
