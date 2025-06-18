
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AddPartnerForm from '@/components/partners/AddPartnerForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, Plus, ArrowLeft, Mail, Phone, Globe, MapPin, Eye, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  nom: string;
  typePartenaire: string;
  secteurActivite: string;
  contactPrincipal: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  siteWeb?: string;
  description?: string;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

const Partners: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Données mockées des partenaires
  const mockPartners: Partner[] = [
    {
      id: '1',
      nom: 'Pôle Emploi Métropole Lilloise',
      typePartenaire: 'Institutionnel',
      secteurActivite: 'Emploi et Insertion',
      contactPrincipal: 'Marie Dupont',
      email: 'marie.dupont@pole-emploi.fr',
      telephone: '03 20 XX XX XX',
      adresse: '15 Rue de la République',
      ville: 'Lille',
      codePostal: '59000',
      siteWeb: 'https://www.pole-emploi.fr',
      description: 'Partenaire principal pour le placement et l\'accompagnement des demandeurs d\'emploi',
      dateCreation: '2023-01-15',
      statut: 'Actif'
    },
    {
      id: '2',
      nom: 'Région Hauts-de-France',
      typePartenaire: 'Collectivité',
      secteurActivite: 'Formation Professionnelle',
      contactPrincipal: 'Jean Martin',
      email: 'jean.martin@hautsdefrance.fr',
      telephone: '03 74 XX XX XX',
      adresse: '151 Avenue du Président Hoover',
      ville: 'Lille',
      codePostal: '59555',
      siteWeb: 'https://www.hautsdefrance.fr',
      description: 'Financeur et partenaire stratégique pour les formations qualifiantes',
      dateCreation: '2023-02-20',
      statut: 'Actif'
    },
    {
      id: '3',
      nom: 'AGEFIPH Nord',
      typePartenaire: 'Institutionnel',
      secteurActivite: 'Emploi et Insertion',
      contactPrincipal: 'Sophie Leroy',
      email: 'sophie.leroy@agefiph.fr',
      telephone: '03 20 XX XX XX',
      adresse: '30 Boulevard Louis XIV',
      ville: 'Lille',
      codePostal: '59000',
      siteWeb: 'https://www.agefiph.fr',
      description: 'Accompagnement des personnes en situation de handicap',
      dateCreation: '2023-03-10',
      statut: 'Actif'
    },
    {
      id: '4',
      nom: 'Métropole Européenne de Lille',
      typePartenaire: 'Collectivité',
      secteurActivite: 'Public',
      contactPrincipal: 'Pierre Rousseau',
      email: 'pierre.rousseau@mel.fr',
      telephone: '03 20 XX XX XX',
      adresse: '2 Rue des Canonniers',
      ville: 'Lille',
      codePostal: '59033',
      siteWeb: 'https://www.lillemetropole.fr',
      description: 'Partenaire territorial pour les formations numériques',
      dateCreation: '2023-04-05',
      statut: 'Actif'
    }
  ];

  const filteredPartners = mockPartners.filter(partner =>
    partner.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.typePartenaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactPrincipal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPartner = (data: any) => {
    console.log('Nouveau partenaire:', data);
    
    toast({
      title: "Partenaire ajouté avec succès",
      description: `${data.nom} a été ajouté à la liste des partenaires.`,
    });
    
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case 'Institutionnel':
        return 'bg-blue-100 text-blue-700';
      case 'Collectivité':
        return 'bg-green-100 text-green-700';
      case 'Entreprise':
        return 'bg-purple-100 text-purple-700';
      case 'Association':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (showAddForm) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleCancelAdd}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la liste</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un Nouveau Partenaire
              </h1>
              <p className="text-gray-600 mt-1">
                Remplissez les informations du nouveau partenaire
              </p>
            </div>
          </div>

          <AddPartnerForm 
            onSubmit={handleAddPartner}
            onCancel={handleCancelAdd}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Partenaires Actifs
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredPartners.length} partenaires • {filteredPartners.filter(p => p.statut === 'Actif').length} actifs
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Partenaire
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, type, secteur ou contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des partenaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{partner.nom}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnerTypeColor(partner.typePartenaire)}`}>
                          {partner.typePartenaire}
                        </span>
                        <span className="text-sm text-gray-500">{partner.secteurActivite}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    partner.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {partner.statut}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">Contact:</span>
                    <span>{partner.contactPrincipal}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${partner.email}`} className="hover:text-primary">
                      {partner.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{partner.telephone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{partner.adresse}, {partner.ville} {partner.codePostal}</span>
                  </div>
                  
                  {partner.siteWeb && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={partner.siteWeb} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                  
                  {partner.description && (
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                      {partner.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      Ajouté le {new Date(partner.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun partenaire trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Aucun partenaire ne correspond à votre recherche.' : 'Commencez par ajouter votre premier partenaire.'}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Partenaire
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Partners;
