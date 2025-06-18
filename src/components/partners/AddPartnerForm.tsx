
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Mail, Phone, MapPin, Save, X, Globe } from 'lucide-react';

const partnerSchema = z.object({
  nom: z.string().min(1, "Le nom de l'organisation est requis"),
  typePartenaire: z.string().min(1, "Le type de partenaire est requis"),
  secteurActivite: z.string().min(1, "Le secteur d'activité est requis"),
  contactPrincipal: z.string().min(1, "Le contact principal est requis"),
  email: z.string().email("Format d'email invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  ville: z.string().min(1, "La ville est requise"),
  codePostal: z.string().regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  siteWeb: z.string().url("Format d'URL invalide").optional().or(z.literal("")),
  description: z.string().optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface AddPartnerFormProps {
  onSubmit: (data: PartnerFormData) => void;
  onCancel: () => void;
}

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
  });

  const handleFormSubmit = (data: PartnerFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span>Ajouter un Nouveau Partenaire</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'Organisation *</Label>
              <Input
                id="nom"
                {...register('nom')}
                placeholder="Ex: Pôle Emploi Nord"
              />
              {errors.nom && (
                <p className="text-sm text-red-600">{errors.nom.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="typePartenaire">Type de Partenaire *</Label>
              <select
                id="typePartenaire"
                {...register('typePartenaire')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner un type</option>
                <option value="institutionnel">Institutionnel</option>
                <option value="entreprise">Entreprise</option>
                <option value="association">Association</option>
                <option value="organisme-formation">Organisme de Formation</option>
                <option value="collectivite">Collectivité</option>
                <option value="financeur">Financeur</option>
              </select>
              {errors.typePartenaire && (
                <p className="text-sm text-red-600">{errors.typePartenaire.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="secteurActivite">Secteur d'Activité *</Label>
              <select
                id="secteurActivite"
                {...register('secteurActivite')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner un secteur</option>
                <option value="emploi-insertion">Emploi et Insertion</option>
                <option value="formation-professionnelle">Formation Professionnelle</option>
                <option value="numerique-technologie">Numérique et Technologie</option>
                <option value="industrie">Industrie</option>
                <option value="services">Services</option>
                <option value="sante-social">Santé et Social</option>
                <option value="commerce">Commerce</option>
                <option value="public">Public</option>
              </select>
              {errors.secteurActivite && (
                <p className="text-sm text-red-600">{errors.secteurActivite.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPrincipal">Contact Principal *</Label>
              <Input
                id="contactPrincipal"
                {...register('contactPrincipal')}
                placeholder="Nom du responsable ou contact"
              />
              {errors.contactPrincipal && (
                <p className="text-sm text-red-600">{errors.contactPrincipal.message}</p>
              )}
            </div>
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Email *</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="contact@partenaire.fr"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Téléphone *</span>
              </Label>
              <Input
                id="telephone"
                {...register('telephone')}
                placeholder="03 XX XX XX XX"
              />
              {errors.telephone && (
                <p className="text-sm text-red-600">{errors.telephone.message}</p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresse" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Adresse *</span>
              </Label>
              <Input
                id="adresse"
                {...register('adresse')}
                placeholder="Numéro et nom de rue"
              />
              {errors.adresse && (
                <p className="text-sm text-red-600">{errors.adresse.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  {...register('ville')}
                  placeholder="Ville"
                />
                {errors.ville && (
                  <p className="text-sm text-red-600">{errors.ville.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal *</Label>
                <Input
                  id="codePostal"
                  {...register('codePostal')}
                  placeholder="59000"
                />
                {errors.codePostal && (
                  <p className="text-sm text-red-600">{errors.codePostal.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteWeb" className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>Site Web (optionnel)</span>
              </Label>
              <Input
                id="siteWeb"
                type="url"
                {...register('siteWeb')}
                placeholder="https://www.partenaire.fr"
              />
              {errors.siteWeb && (
                <p className="text-sm text-red-600">{errors.siteWeb.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Description des activités et de la collaboration..."
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
              <span>{isSubmitting ? 'Ajout...' : 'Ajouter le Partenaire'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPartnerForm;
