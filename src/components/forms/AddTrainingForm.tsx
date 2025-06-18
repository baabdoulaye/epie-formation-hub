
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface AddTrainingFormProps {
  onBack: () => void;
}

const AddTrainingForm: React.FC<AddTrainingFormProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Formation créée",
      description: `La formation "${formData.title}" a été créée avec succès.`,
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
          <CardTitle>Créer une Nouvelle Formation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre de la formation</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nom de la formation"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="numerique">Formations Numériques</option>
              <option value="socles">Socles de Compétences</option>
              <option value="linguistique">Formations Linguistiques</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Durée (en heures)</label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="Durée en heures"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-lg h-24"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la formation"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit">Créer la Formation</Button>
            <Button type="button" variant="outline" onClick={onBack}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTrainingForm;
