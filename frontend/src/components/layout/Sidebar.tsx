import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  User,
  File,
  Menu,
  X,
  Briefcase,
  Building,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/**
 * Interface pour les éléments de navigation
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  // badge?: number; // Plus besoin du badge
}

/**
 * Composant Sidebar - Navigation latérale principale
 * * Affiche les liens de navigation principaux avec icônes
 * et gestion de l'état actif
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Définition des éléments de navigation (sans les badges)
  const navigationItems: NavItem[] = [
    {
      label: "Tableau de Bord",
      href: "/",
      icon: Calendar,
    },
    {
      label: "Stagiaires",
      href: "/stagiaires",
      icon: Users,
    },
    {
      label: "Formations",
      href: "/formations",
      icon: File,
    },
    {
      label: "Stages",
      href: "/stages",
      icon: Briefcase,
    },
    {
      label: "Employés",
      href: "/employes",
      icon: User,
    },
    {
      label: "Partenaires",
      href: "/partenaires",
      icon: Building,
    },
  ];

  /**
   * Vérifie si un lien de navigation est actif
   */
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header du sidebar avec bouton de fermeture sur mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">
            Navigation
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation principale */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsCollapsed(true)} // Fermer le sidebar sur mobile après clic
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>

                {/* Le badge est retiré ici */}
              </Link>
            );
          })}
        </nav>

        {/* Section informations rapides (reste inchangée) */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-epie-blue/10 to-epie-green/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Statistiques Rapides
            </h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Sessions en cours:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Nouveaux stagiaires:</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Bouton pour ouvrir le sidebar sur mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-20 left-4 z-40 lg:hidden"
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};

export default Sidebar;
