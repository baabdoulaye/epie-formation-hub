
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
 * Affiche le logo EPIE Connect et le menu utilisateur simplifié
 */
const Header: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

        {/* Actions utilisateur - Uniquement déconnexion */}
        <div className="flex items-center space-x-2 ml-4">
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-gray-100 text-red-600 border-red-300 hover:border-red-400"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se Déconnecter
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
