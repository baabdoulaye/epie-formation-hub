// frontend/src/components/sessions/EditSessionForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Save, X, Clock, Users } from "lucide-react";

// Interface Session (copiée de Sessions.tsx)
interface Session {
  id: string;
  _id?: string;
  title: string;
  formation: string;
  formateur: string;
  dateDebut: string; // Garder comme string pour l'affichage, convertir si besoin pour l'API (Date)
  dateFin: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  capaciteMax: number;
  participantsInscrits: number; // Assure-toi que cette propriété existe
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée";
  description?: string;
}

// MISE À JOUR DU SCHÉMA ZOD :
// capaciteMax est toujours là, et participantsInscrits est maintenant validé
const sessionSchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    formation: z.string().min(1, "La formation est requise"),
    formateur: z.string().min(1, "Le formateur est requis"),
    dateDebut: z.string().min(1, "La date de début est requise"),
    dateFin: z.string().min(1, "La date de fin est requise"),
    heureDebut: z
      .string()
      .min(1, "L'heure de début est requise")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)"),
    heureFin: z
      .string()
      .min(1, "L'heure de fin est requise")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)"),
    lieu: z.string().min(1, "Le lieu est requis"),
    capaciteMax: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(1, "La capacité maximale doit être au moins de 1")
        .int("La capacité doit être un nombre entier")
    ),
    // NOUVEAU: participantsInscrits est un champ saisissable
    participantsInscrits: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, "Le nombre de participants ne peut pas être négatif")
        .int("Le nombre de participants doit être un entier")
    ),
    description: z.string().optional(),
  })
  .refine((data) => data.participantsInscrits <= data.capaciteMax, {
    message:
      "Le nombre de participants inscrits ne peut pas dépasser la capacité maximale.",
    path: ["participantsInscrits"], // Affiche l'erreur sous le champ participantsInscrits
  });

type SessionFormData = z.infer<typeof sessionSchema>;

interface EditSessionFormProps {
  session: Session; // La session à modifier
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
}

const EditSessionForm: React.FC<EditSessionFormProps> = ({
  session,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      // Pré-remplir le formulaire avec les données de la session existante
      title: session.title,
      formation: session.formation,
      formateur: session.formateur,
      dateDebut: session.dateDebut, // Format YYYY-MM-DD
      dateFin: session.dateFin, // Format YYYY-MM-DD
      heureDebut: session.heureDebut,
      heureFin: session.heureFin,
      lieu: session.lieu,
      capaciteMax: session.capaciteMax,
      participantsInscrits: session.participantsInscrits, // NOUVEAU: Ajout de participantsInscrits aux defaultValues
      description: session.description || "",
    },
  });

  // Mettre à jour les valeurs par défaut si la session change (au cas où on voudrait modifier une autre session sans recharger)
  useEffect(() => {
    reset({
      title: session.title,
      formation: session.formation,
      formateur: session.formateur,
      dateDebut: session.dateDebut,
      dateFin: session.dateFin,
      heureDebut: session.heureDebut,
      heureFin: session.heureFin,
      lieu: session.lieu,
      capaciteMax: session.capaciteMax,
      participantsInscrits: session.participantsInscrits, // NOUVEAU: Ajout de participantsInscrits aux defaultValues du reset
      description: session.description || "",
    });
  }, [session, reset]);

  const handleFormSubmit = (data: SessionFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Modifier la Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* ... (autres champs comme titre, formation, formateur, lieu, dates, heures) ... */}

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la Session *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Ex: Formation Excel Avancé - Groupe A"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="formation">Formation Associée *</Label>
              <select
                id="formation"
                {...register("formation")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner une formation</option>
                <option value="technicien-assistance-informatique">
                  TP - Technicien(ne) d'Assistance Informatique
                </option>
                <option value="clea-competences-base">
                  Formation Cléa - Compétences de base
                </option>
                <option value="francais-langue-etrangere">
                  Français Langue Étrangère
                </option>
                <option value="bureautique-avance">Bureautique Avancée</option>
                <option value="comptabilite-gestion">
                  Comptabilité et Gestion
                </option>
              </select>
              {errors.formation && (
                <p className="text-sm text-red-600">
                  {errors.formation.message}
                </p>
              )}
            </div>
          </div>

          {/* Formateur et lieu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="formateur">Formateur *</Label>
              <select
                id="formateur"
                {...register("formateur")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner un formateur</option>
                <option value="pierre-martin">Pierre Martin</option>
                <option value="sophie-dubois">Sophie Dubois</option>
                <option value="marie-leroy">Marie Leroy</option>
                <option value="jean-bernard">Jean Bernard</option>
                <option value="claire-rousseau">Claire Rousseau</option>
              </select>
              {errors.formateur && (
                <p className="text-sm text-red-600">
                  {errors.formateur.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieu" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Lieu *</span>
              </Label>
              <Input
                id="lieu"
                {...register("lieu")}
                placeholder="Ex: Salle de formation A, Centre EPIE"
              />
              {errors.lieu && (
                <p className="text-sm text-red-600">{errors.lieu.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de Début *</Label>
              <Input id="dateDebut" type="date" {...register("dateDebut")} />
              {errors.dateDebut && (
                <p className="text-sm text-red-600">
                  {errors.dateDebut.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de Fin *</Label>
              <Input id="dateFin" type="date" {...register("dateFin")} />
              {errors.dateFin && (
                <p className="text-sm text-red-600">{errors.dateFin.message}</p>
              )}
            </div>
          </div>

          {/* Heures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="heureDebut"
                className="flex items-center space-x-1"
              >
                <Clock className="h-4 w-4" />
                <span>Heure de Début *</span>
              </Label>
              <Input id="heureDebut" type="time" {...register("heureDebut")} />
              {errors.heureDebut && (
                <p className="text-sm text-red-600">
                  {errors.heureDebut.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heureFin" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Heure de Fin *</span>
              </Label>
              <Input id="heureFin" type="time" {...register("heureFin")} />
              {errors.heureFin && (
                <p className="text-sm text-red-600">
                  {errors.heureFin.message}
                </p>
              )}
            </div>
          </div>

          {/* MISE À JOUR : Capacité Maximale et Nombre de Stagiaires (saisissables) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="capaciteMax"
                className="flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>Capacité Maximale *</span>
              </Label>
              <Input
                id="capaciteMax"
                type="number"
                min="1"
                {...register("capaciteMax")}
                placeholder="Ex: 20"
              />
              {errors.capaciteMax && (
                <p className="text-sm text-red-600">
                  {errors.capaciteMax.message}
                </p>
              )}
            </div>

            {/* ANCIENNE DIV POUR LA CAPACITÉ MAXIMALE - MAINTENANT C'EST LE NOMBRE DE STAGIAIRES */}
            <div className="space-y-2">
              <Label
                htmlFor="participantsInscrits"
                className="flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>Nombre de Stagiaires *</span> {/* Libellé mis à jour */}
              </Label>
              <Input
                id="participantsInscrits"
                type="number"
                min="0" // Le nombre de stagiaires peut être 0 au début
                {...register("participantsInscrits")} // Maintenant enregistré dans le formulaire
                placeholder="Ex: 15"
              />
              {errors.participantsInscrits && (
                <p className="text-sm text-red-600">
                  {errors.participantsInscrits.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Informations complémentaires sur la session..."
              rows={3}
            />
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
                {isSubmitting ? "Mise à jour..." : "Mettre à jour la Session"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditSessionForm;
