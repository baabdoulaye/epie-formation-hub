
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface AddEmployeeFormProps {
  onBack: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    civilite: '',
    nom: '',
    prenom: '',
    poste: '',
    service: '',
    email: '',
    telephone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Employé ajouté",
      description: `${formData.prenom} ${formData.nom} a été ajouté avec succès.`,
    });
    onBack();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Ajouter un Nouvel Employé</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Civilité</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.civilite}
                onChange={(e) => handleChange('civilite', e.target.value)}
                required
              >
                <option value="">Sélectionner</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Nom de famille"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <Input
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Poste</label>
              <Input
                value={formData.poste}
                onChange={(e) => handleChange('poste', e.target.value)}
                placeholder="Poste occupé"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Service</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.service}
                onChange={(e) => handleChange('service', e.target.value)}
                required
              >
                <option value="">Sélectionner un service</option>
                <option value="Direction">Direction</option>
                <option value="Pédagogie">Pédagogie</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@epie.fr"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                placeholder="01 23 45 67 89"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit">Ajouter l'Employé</Button>
            <Button type="button" variant="outline" onClick={onBack}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
