
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/**
 * Composant Header - Barre de navigation principale
 * 
 * Affiche le logo EPIE Connect, la barre de recherche,
 * et le menu utilisateur
 */
const Header: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      toast({
        title: "Recherche",
        description: `Recherche pour: "${searchTerm}"`,
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/employes');
    toast({
      title: "Mon Profil",
      description: "Redirection vers la gestion des employés",
    });
  };

  const handleLogoutClick = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
      variant: "destructive",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo et nom de l'application */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg epie-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">EPIE Connect</h1>
            <p className="text-xs text-gray-500">Intranet de Gestion</p>
          </div>
        </div>

        {/* Espace flexible pour pousser les éléments vers la droite */}
        <div className="flex-1" />

        {/* Barre de recherche - masquée sur mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
            />
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Marie Dubois</p>
                  <p className="text-xs text-gray-500">Administratrice</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Mon Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogoutClick}>
                <LogOut className="mr-2 h-4 w-4" />
                Se Déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
