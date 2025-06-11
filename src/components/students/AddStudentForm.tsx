
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, User, MapPin, GraduationCap, FileText, Users } from 'lucide-react';

/**
 * Schéma de validation pour le formulaire d'ajout de stagiaire
 * Utilise Zod pour valider tous les champs requis
 */
const studentFormSchema = z.object({
  // Informations personnelles de base
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  
  // Date de naissance et âge
  birthDate: z.string().min(1, "Date de naissance requise"),
  age: z.number().min(16).max(99),
  
  // Adresse de résidence
  address: z.string().min(5, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(2, "Ville requise"),
  department: z.string().min(2, "Département requis"),
  
  // Lieu de naissance
  birthCity: z.string().min(2, "Ville de naissance requise"),
  birthCountry: z.string().min(2, "Pays de naissance requis"),
  
  // Organisme prescripteur
  prescribingOrganization: z.string().min(2, "Organisme prescripteur requis"),
  prescribingCity: z.string().min(2, "Ville prescripteur requise"),
  
  // Niveau d'études
  educationLevel: z.string().min(1, "Niveau d'études requis"),
  
  // Dates et présences
  infoCollectiveDate: z.string().optional(),
  presentAtInfoCollective: z.boolean(),
  presentAtIndividualInterview: z.boolean(),
  
  // Évaluation
  positioning: z.string().min(2, "Positionnement requis"),
  centerDecision: z.string().min(2, "Décision du centre requise"),
  result: z.string().min(2, "Résultat requis"),
  
  // Parcours
  pathway1: z.string().optional(),
  pathway2: z.string().optional(),
  
  // Information candidat
  candidateInformation: z.string().min(5, "Information candidat requise"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

/**
 * Props pour le composant AddStudentForm
 */
interface AddStudentFormProps {
  onSubmit: (data: StudentFormValues) => void;
  onCancel: () => void;
}

/**
 * Composant AddStudentForm - Formulaire complet d'ajout de stagiaire
 * 
 * Ce formulaire permet de saisir toutes les informations détaillées
 * d'un nouveau stagiaire selon les spécifications d'EPIE Formation
 */
const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      age: 18,
      address: '',
      postalCode: '',
      city: '',
      department: '',
      birthCity: '',
      birthCountry: 'France',
      prescribingOrganization: '',
      prescribingCity: '',
      educationLevel: '',
      infoCollectiveDate: '',
      presentAtInfoCollective: false,
      presentAtIndividualInterview: false,
      positioning: '',
      centerDecision: '',
      result: '',
      pathway1: '',
      pathway2: '',
      candidateInformation: '',
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section Informations Personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Informations Personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom du stagiaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du stagiaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de Naissance *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge *</FormLabel>
                    <FormControl>
                      <Input type="number" min="16" max="99" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section Lieu de Naissance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Lieu de Naissance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville de Naissance *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville de naissance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays de Naissance *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays de naissance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section Adresse de Résidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-secondary" />
                <span>Adresse de Résidence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Adresse *</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse complète" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Postal *</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville de Résidence *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Département *</FormLabel>
                    <FormControl>
                      <Input placeholder="Département" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section Organisme Prescripteur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Organisme Prescripteur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prescribingOrganization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisme Prescripteur *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'organisme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prescribingCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville Prescripteur *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville de l'organisme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section Formation et Évaluation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-secondary" />
                <span>Formation et Évaluation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'Études *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le niveau d'études" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sans-diplome">Sans diplôme</SelectItem>
                        <SelectItem value="cap-bep">CAP/BEP</SelectItem>
                        <SelectItem value="bac">Baccalauréat</SelectItem>
                        <SelectItem value="bac-2">Bac+2</SelectItem>
                        <SelectItem value="bac-3">Bac+3</SelectItem>
                        <SelectItem value="bac-5">Bac+5 et plus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="infoCollectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Info Collective</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="presentAtInfoCollective"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Présent à l'Info Collective</FormLabel>
                          <FormDescription>Le stagiaire était-il présent ?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="presentAtIndividualInterview"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Présent à l'Entretien Individuel</FormLabel>
                          <FormDescription>Le stagiaire était-il présent ?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Positionnement et Décisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Positionnement et Décisions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="positioning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positionnement *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez le positionnement du stagiaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="centerDecision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Décision du Centre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Décision prise par le centre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Résultat *</FormLabel>
                    <FormControl>
                      <Input placeholder="Résultat de l'évaluation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pathway1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcours 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Premier parcours proposé" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pathway2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcours 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Deuxième parcours proposé" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section Information Candidat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-secondary" />
                <span>Information du Candidat/Conseiller</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="candidateInformation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Information du Candidat/Conseiller sur le Statut de la Candidature *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informations communiquées au candidat ou au conseiller concernant le statut de sa candidature..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Détaillez les informations transmises au candidat ou à son conseiller
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="px-8"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="px-8 bg-primary hover:bg-primary/90"
            >
              Ajouter le Stagiaire
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddStudentForm;
