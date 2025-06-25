
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from "@/components/ui/toaster";

/**
 * Interface pour les props du Layout
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Composant Layout - Structure principale de l'application
 * 
 * Organise l'interface avec l'en-tête, la barre latérale et le contenu principal
 * Fournit une structure cohérente pour toutes les pages de l'application
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête fixe */}
      <Header />
      
      {/* Conteneur principal avec sidebar et contenu */}
      <div className="flex">
        {/* Barre latérale de navigation */}
        <Sidebar />
        
        {/* Zone de contenu principal */}
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Toaster pour les notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
