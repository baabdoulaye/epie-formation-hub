
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InternshipFormData } from '@/types';
import { Save, X, User, Building, UserCheck, Calendar } from 'lucide-react';

/**
 * Schéma de validation pour le formulaire de stage
 */
const internshipSchema = z.object({
  civiliteEtudiant: z.enum(['M.', 'Mme', 'Mlle'], {
    required_error: "La civilité est requise"
  }),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  dateNaissanceEtudiant: z.string().min(1, "La date de naissance est requise"),
  adresseEtudiant: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  codePostalEtudiant: z.string().regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  villeEtudiant: z.string().min(2, "La ville est requise"),
  telEtudiant: z.string().min(10, "Le numéro de téléphone est requis"),
  emailEtudiant: z.string().email("L'adresse email n'est pas valide"),
  entreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
  dateStage: z.string().min(1, "La date de stage est requise"),
  secteurEntreprise: z.string().min(2, "Le secteur d'activité est requis"),
  adresseEntreprise: z.string().min(5, "L'adresse de l'entreprise est requise"),
  cpeEntreprise: z.string().min(5, "Le code postal de l'entreprise est requis"),
  villeEntreprise: z.string().min(2, "La ville de l'entreprise est requise"),
  civiliteTuteur: z.enum(['M.', 'Mme', 'Mlle'], {
    required_error: "La civilité du tuteur est requise"
  }),
  tuteurStage: z.string().min(2, "Le nom du tuteur est requis"),
  telTuteur: z.string().min(10, "Le téléphone du tuteur est requis"),
  emailTuteur: z.string().email("L'email du tuteur n'est pas valide"),
  conventionnee: z.boolean(),
  observations: z.string().optional(),
  dateHeureVisite: z.string().min(1, "La date/heure de visite est requise"),
  typeVisite: z.enum(['telephone', 'visio', 'presentiel'], {
    required_error: "Le type de visite est requis"
  })
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
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      civiliteEtudiant: 'M.',
      civiliteTuteur: 'M.',
      conventionnee: true,
      typeVisite: 'presentiel'
    }
  });

  /**
   * Gestion de la soumission du formulaire
   */
  const onFormSubmit = (data: InternshipFormData) => {
    console.log('Données du stage:', data);
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        
        {/* Section Informations du Stagiaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Informations du Stagiaire</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="civiliteEtudiant">Civilité *</Label>
                <select
                  {...register('civiliteEtudiant')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
                {errors.civiliteEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.civiliteEtudiant.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  {...register('nom')}
                  placeholder="Nom du stagiaire"
                  className="mt-1"
                />
                {errors.nom && (
                  <p className="text-sm text-red-600 mt-1">{errors.nom.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  {...register('prenom')}
                  placeholder="Prénom du stagiaire"
                  className="mt-1"
                />
                {errors.prenom && (
                  <p className="text-sm text-red-600 mt-1">{errors.prenom.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateNaissanceEtudiant">Date de Naissance *</Label>
                <Input
                  type="date"
                  {...register('dateNaissanceEtudiant')}
                  className="mt-1"
                />
                {errors.dateNaissanceEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.dateNaissanceEtudiant.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="emailEtudiant">Email Stagiaire *</Label>
                <Input
                  type="email"
                  {...register('emailEtudiant')}
                  placeholder="email@example.com"
                  className="mt-1"
                />
                {errors.emailEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.emailEtudiant.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="adresseEtudiant">Adresse du Stagiaire *</Label>
              <Input
                {...register('adresseEtudiant')}
                placeholder="Adresse complète"
                className="mt-1"
              />
              {errors.adresseEtudiant && (
                <p className="text-sm text-red-600 mt-1">{errors.adresseEtudiant.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="codePostalEtudiant">Code Postal *</Label>
                <Input
                  {...register('codePostalEtudiant')}
                  placeholder="75000"
                  className="mt-1"
                />
                {errors.codePostalEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.codePostalEtudiant.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="villeEtudiant">Ville *</Label>
                <Input
                  {...register('villeEtudiant')}
                  placeholder="Ville du stagiaire"
                  className="mt-1"
                />
                {errors.villeEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.villeEtudiant.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="telEtudiant">Téléphone *</Label>
                <Input
                  {...register('telEtudiant')}
                  placeholder="01 23 45 67 89"
                  className="mt-1"
                />
                {errors.telEtudiant && (
                  <p className="text-sm text-red-600 mt-1">{errors.telEtudiant.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Informations de l'Entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-secondary" />
              <span>Informations de l'Entreprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entreprise">Nom de l'Entreprise *</Label>
                <Input
                  {...register('entreprise')}
                  placeholder="Nom de l'entreprise"
                  className="mt-1"
                />
                {errors.entreprise && (
                  <p className="text-sm text-red-600 mt-1">{errors.entreprise.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="secteurEntreprise">Secteur d'Activité *</Label>
                <Input
                  {...register('secteurEntreprise')}
                  placeholder="Secteur d'activité"
                  className="mt-1"
                />
                {errors.secteurEntreprise && (
                  <p className="text-sm text-red-600 mt-1">{errors.secteurEntreprise.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="adresseEntreprise">Adresse de l'Entreprise *</Label>
              <Input
                {...register('adresseEntreprise')}
                placeholder="Adresse complète de l'entreprise"
                className="mt-1"
              />
              {errors.adresseEntreprise && (
                <p className="text-sm text-red-600 mt-1">{errors.adresseEntreprise.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpeEntreprise">Code Postal Entreprise *</Label>
                <Input
                  {...register('cpeEntreprise')}
                  placeholder="Code postal"
                  className="mt-1"
                />
                {errors.cpeEntreprise && (
                  <p className="text-sm text-red-600 mt-1">{errors.cpeEntreprise.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="villeEntreprise">Ville Entreprise *</Label>
                <Input
                  {...register('villeEntreprise')}
                  placeholder="Ville de l'entreprise"
                  className="mt-1"
                />
                {errors.villeEntreprise && (
                  <p className="text-sm text-red-600 mt-1">{errors.villeEntreprise.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Informations du Tuteur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-accent" />
              <span>Informations du Tuteur</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="civiliteTuteur">Civilité Tuteur *</Label>
                <select
                  {...register('civiliteTuteur')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
                {errors.civiliteTuteur && (
                  <p className="text-sm text-red-600 mt-1">{errors.civiliteTuteur.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="tuteurStage">Nom du Tuteur *</Label>
                <Input
                  {...register('tuteurStage')}
                  placeholder="Nom complet du tuteur"
                  className="mt-1"
                />
                {errors.tuteurStage && (
                  <p className="text-sm text-red-600 mt-1">{errors.tuteurStage.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="telTuteur">Téléphone Tuteur *</Label>
                <Input
                  {...register('telTuteur')}
                  placeholder="01 23 45 67 89"
                  className="mt-1"
                />
                {errors.telTuteur && (
                  <p className="text-sm text-red-600 mt-1">{errors.telTuteur.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="emailTuteur">Email Tuteur *</Label>
              <Input
                type="email"
                {...register('emailTuteur')}
                placeholder="tuteur@entreprise.com"
                className="mt-1"
              />
              {errors.emailTuteur && (
                <p className="text-sm text-red-600 mt-1">{errors.emailTuteur.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Informations du Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Informations du Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateStage">Date de Stage *</Label>
                <Input
                  type="date"
                  {...register('dateStage')}
                  className="mt-1"
                />
                {errors.dateStage && (
                  <p className="text-sm text-red-600 mt-1">{errors.dateStage.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="dateHeureVisite">Date/Heure de Visite *</Label>
                <Input
                  type="datetime-local"
                  {...register('dateHeureVisite')}
                  className="mt-1"
                />
                {errors.dateHeureVisite && (
                  <p className="text-sm text-red-600 mt-1">{errors.dateHeureVisite.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="typeVisite">Type de Visite *</Label>
                <select
                  {...register('typeVisite')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="presentiel">Présentiel</option>
                  <option value="telephone">Téléphone</option>
                  <option value="visio">Visioconférence</option>
                </select>
                {errors.typeVisite && (
                  <p className="text-sm text-red-600 mt-1">{errors.typeVisite.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-8">
                <input
                  type="checkbox"
                  {...register('conventionnee')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="conventionnee">Stage conventionné</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                {...register('observations')}
                placeholder="Observations sur le stage..."
                className="mt-1"
                rows={3}
              />
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le Stage'}
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
