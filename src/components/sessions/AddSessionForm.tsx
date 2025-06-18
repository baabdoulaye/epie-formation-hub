
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, MapPin, Save, X } from 'lucide-react';

const sessionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  formation: z.string().min(1, "La formation est requise"),
  formateur: z.string().min(1, "Le formateur est requis"),
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
  heureDebut: z.string().min(1, "L'heure de début est requise"),
  heureFin: z.string().min(1, "L'heure de fin est requise"),
  lieu: z.string().min(1, "Le lieu est requis"),
  capaciteMax: z.number().min(1, "La capacité maximale doit être supérieure à 0"),
  description: z.string().optional(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface AddSessionFormProps {
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
  });

  const handleFormSubmit = (data: SessionFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Planifier une Nouvelle Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la Session *</Label>
              <Input
                id="title"
                {...register('title')}
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
                {...register('formation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner une formation</option>
                <option value="technicien-assistance-informatique">TP - Technicien(ne) d'Assistance Informatique</option>
                <option value="clea-competences-base">Formation Cléa - Compétences de base</option>
                <option value="francais-langue-etrangere">Français Langue Étrangère</option>
                <option value="bureautique-avance">Bureautique Avancée</option>
                <option value="comptabilite-gestion">Comptabilité et Gestion</option>
              </select>
              {errors.formation && (
                <p className="text-sm text-red-600">{errors.formation.message}</p>
              )}
            </div>
          </div>

          {/* Formateur et lieu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="formateur">Formateur *</Label>
              <select
                id="formateur"
                {...register('formateur')}
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
                <p className="text-sm text-red-600">{errors.formateur.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieu" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Lieu *</span>
              </Label>
              <Input
                id="lieu"
                {...register('lieu')}
                placeholder="Ex: Salle de formation A, Centre EPIE"
              />
              {errors.lieu && (
                <p className="text-sm text-red-600">{errors.lieu.message}</p>
              )}
            </div>
          </div>

          {/* Dates et heures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de Début *</Label>
              <Input
                id="dateDebut"
                type="date"
                {...register('dateDebut')}
              />
              {errors.dateDebut && (
                <p className="text-sm text-red-600">{errors.dateDebut.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de Fin *</Label>
              <Input
                id="dateFin"
                type="date"
                {...register('dateFin')}
              />
              {errors.dateFin && (
                <p className="text-sm text-red-600">{errors.dateFin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heureDebut" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Heure Début *</span>
              </Label>
              <Input
                id="heureDebut"
                type="time"
                {...register('heureDebut')}
              />
              {errors.heureDebut && (
                <p className="text-sm text-red-600">{errors.heureDebut.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heureFin">Heure Fin *</Label>
              <Input
                id="heureFin"
                type="time"
                {...register('heureFin')}
              />
              {errors.heureFin && (
                <p className="text-sm text-red-600">{errors.heureFin.message}</p>
              )}
            </div>
          </div>

          {/* Capacité et description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="capaciteMax" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Capacité Maximale *</span>
              </Label>
              <Input
                id="capaciteMax"
                type="number"
                min="1"
                {...register('capaciteMax', { valueAsNumber: true })}
                placeholder="Ex: 15"
              />
              {errors.capaciteMax && (
                <p className="text-sm text-red-600">{errors.capaciteMax.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Informations complémentaires sur la session..."
                rows={3}
              />
            </div>
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
              <span>{isSubmitting ? 'Création...' : 'Planifier la Session'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSessionForm;
