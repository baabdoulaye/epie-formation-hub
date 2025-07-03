import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { User, MapPin, GraduationCap, FileText, Users } from "lucide-react";

/**
 * Schéma de validation pour le formulaire d'ajout de stagiaire
 * Utilise Zod pour valider tous les champs requis
 */
const studentFormSchema = z.object({
  _id: z.string().optional(), // *** AJOUTE CE CHAMP POUR L'ID DU STAGIAIRE (OPTIONNEL CAR PAS POUR L'AJOUT) ***
  // Informations personnelles de base
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")), // Permet string vide ou email valide
  phone: z.string().optional(),

  // Date de naissance et âge
  birthDate: z.string().optional(),
  age: z.union([z.number().min(16).max(99), z.nan()]).optional(), // Gère NaN pour champ vide si type="number"

  // Adresse de résidence
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),

  // Lieu de naissance
  birthCity: z.string().optional(),
  birthCountry: z.string().optional(),

  // Organisme prescripteur
  prescribingOrganization: z.string().optional(),
  prescribingCity: z.string().optional(),

  // Niveau d'études
  educationLevel: z.string().optional(),

  // Dates et présences
  infoCollectiveDate: z.string().optional(),
  presentAtInfoCollective: z.boolean().optional(),
  presentAtIndividualInterview: z.boolean().optional(),

  // Évaluation
  positioning: z.string().optional(),
  centerDecision: z.string().optional(),
  result: z.string().optional(),

  // Parcours
  pathway1: z.string().optional(),
  pathway2: z.string().optional(),

  // Information candidat
  candidateInformation: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

/**
 * Props pour le composant AddStudentForm
 */
interface AddStudentFormProps {
  onSubmit: (data: StudentFormValues) => void;
  onCancel: () => void;
  initialData?: any; // Contient les données brutes du stagiaire, y compris _id et potentiellement prenom/nom
}

/**
 * Composant AddStudentForm - Formulaire complet d'ajout de stagiaire
 * * Ce formulaire permet de saisir toutes les informations détaillées
 * d'un nouveau stagiaire selon les spécifications d'EPIE Formation
 */
const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      // Si initialData est présent, utilise-le pour les valeurs par défaut
      // Sinon, utilise les valeurs vides pour un nouveau formulaire
      _id: initialData?._id || undefined, // *** AJOUTE L'_ID DANS LES DEFAULTVALUES ***
      firstName: initialData?.firstName || "", // Utilise initialData.firstName directement si disponible
      lastName: initialData?.lastName || "", // Utilise initialData.lastName directement si disponible
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      birthDate: initialData?.birthDate || "",
      age: initialData?.age || undefined,
      address: initialData?.address || "",
      postalCode: initialData?.postalCode || "",
      city: initialData?.city || "",
      department: initialData?.department || "",
      birthCity: initialData?.birthCity || "",
      birthCountry: initialData?.birthCountry || "France",
      prescribingOrganization: initialData?.prescribingOrganization || "",
      prescribingCity: initialData?.prescribingCity || "",
      educationLevel: initialData?.educationLevel || "",
      infoCollectiveDate: initialData?.infoCollectiveDate || "",
      presentAtInfoCollective: initialData?.presentAtInfoCollective || false,
      presentAtIndividualInterview:
        initialData?.presentAtIndividualInterview || false,
      positioning: initialData?.positioning || "",
      centerDecision: initialData?.centerDecision || "",
      result: initialData?.result || "",
      pathway1: initialData?.pathway1 || "",
      pathway2: initialData?.pathway2 || "",
      candidateInformation: initialData?.candidateInformation || "",
    },
  });

  // Utilise useEffect pour réinitialiser le formulaire si initialData change
  // C'est important si tu modifies plusieurs stagiaires sans recharger le composant
  useEffect(() => {
    if (initialData) {
      form.reset({
        _id: initialData._id, // Assure que _id est bien défini ici pour le reset
        firstName: initialData.firstName || "", // Ajout de || ""
        lastName: initialData.lastName || "", // Ajout de || ""
        email: initialData.email || "",
        phone: initialData.phone || "",
        birthDate: initialData.birthDate || "",
        age: initialData.age || undefined,
        address: initialData.address || "",
        postalCode: initialData.postalCode || "",
        city: initialData.city || "",
        department: initialData.department || "",
        birthCity: initialData.birthCity || "",
        birthCountry: initialData.birthCountry || "France",
        prescribingOrganization: initialData.prescribingOrganization || "",
        prescribingCity: initialData.prescribingCity || "",
        educationLevel: initialData.educationLevel || "",
        infoCollectiveDate: initialData.infoCollectiveDate || "",
        presentAtInfoCollective: initialData.presentAtInfoCollective || false,
        presentAtIndividualInterview:
          initialData.presentAtIndividualInterview || false,
        positioning: initialData.positioning || "",
        centerDecision: initialData.centerDecision || "",
        result: initialData.result || "",
        pathway1: initialData.pathway1 || "",
        pathway2: initialData.pathway2 || "",
        candidateInformation: initialData.candidateInformation || "",
      });
    } else {
      // Réinitialise à des valeurs par défaut vides pour un nouvel ajout
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: "",
        age: undefined,
        address: "",
        postalCode: "",
        city: "",
        department: "",
        birthCity: "",
        birthCountry: "France",
        prescribingOrganization: "",
        prescribingCity: "",
        educationLevel: "",
        infoCollectiveDate: "",
        presentAtInfoCollective: false,
        presentAtIndividualInterview: false,
        positioning: "",
        centerDecision: "",
        result: "",
        pathway1: "",
        pathway2: "",
        candidateInformation: "",
      });
    }
  }, [initialData, form]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        {/*
          IMPORTANT: Le `onSubmit` de <form> va appeler `form.handleSubmit(onSubmit)`.
          React Hook Form va collecter TOUTES les valeurs enregistrées (via form.register ou Field/Controller)
          et les passera à la fonction `onSubmit` fournie par les props.
          Comme nous avons ajouté `_id` au schéma et que nous le définissons dans `defaultValues` / `reset`,
          il sera automatiquement inclus dans l'objet `data` passé à `onSubmit`.
        */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Champ caché pour l'ID du stagiaire - TRÈS IMPORTANT POUR LA MODIFICATION */}
          {/* Ce champ assure que l'_id est inclus dans les données soumises par le formulaire */}
          {initialData?._id && (
            <FormField
              control={form.control}
              name="_id" // Le nom doit correspondre à la propriété dans le schéma
              render={({ field }) => (
                <FormItem className="hidden">
                  {" "}
                  {/* Rendre l'élément caché */}
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

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
                name="firstName" // Change "prenom" to "firstName" to match API
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom du stagiaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName" // Change "nom" to "lastName" to match API
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemple.com"
                        {...field}
                      />
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
                    <FormLabel>Téléphone</FormLabel>{" "}
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
                    <FormLabel>Date de Naissance</FormLabel>{" "}
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
                    <FormLabel>Âge</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="16"
                        max="99"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          ); // Gère le champ vide comme undefined
                        }}
                      />
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
                    <FormLabel>Ville de Naissance</FormLabel>{" "}
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
                    <FormLabel>Pays de Naissance</FormLabel>{" "}
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
                    <FormLabel>Adresse</FormLabel>{" "}
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
                    <FormLabel>Code Postal</FormLabel>{" "}
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
                    <FormLabel>Ville de Résidence</FormLabel>{" "}
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
                    <FormLabel>Département</FormLabel>{" "}
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
                    <FormLabel>Organisme Prescripteur</FormLabel>{" "}
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
                    <FormLabel>Ville Prescripteur</FormLabel>{" "}
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
                    <FormLabel>Niveau d'Études</FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le niveau d'études" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sans-diplome">
                          Sans diplôme
                        </SelectItem>
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
                          <FormDescription>
                            Le stagiaire était-il présent ?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            // Assure que le switch peut être non défini si le champ est optional
                            // Ne pas inclure si tu veux qu'il soit toujours true/false
                          />
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
                          <FormLabel>
                            Présent à l'Entretien Individuel
                          </FormLabel>
                          <FormDescription>
                            Le stagiaire était-il présent ?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            // Assure que le switch peut être non défini si le champ est optional
                            // Ne pas inclure si tu veux qu'il soit toujours true/false
                          />
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
                    <FormLabel>Positionnement</FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le positionnement du stagiaire"
                        {...field}
                      />
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
                    <FormLabel>Décision du Centre</FormLabel>{" "}
                    <FormControl>
                      <Input
                        placeholder="Décision prise par le centre"
                        {...field}
                      />
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
                    <FormLabel>Résultat</FormLabel>{" "}
                    <FormControl>
                      <Input
                        placeholder="Résultat de l'évaluation"
                        {...field}
                      />
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
                      <Input
                        placeholder="Premier parcours proposé"
                        {...field}
                      />
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
                      <Input
                        placeholder="Deuxième parcours proposé"
                        {...field}
                      />
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
                    <FormLabel>
                      Information du Candidat/Conseiller sur le Statut de la
                      Candidature
                    </FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder="Informations communiquées au candidat ou au conseiller concernant le statut de sa candidature..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Détaillez les informations transmises au candidat ou à son
                      conseiller
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
              {initialData ? "Modifier le Stagiaire" : "Ajouter le Stagiaire"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddStudentForm;
