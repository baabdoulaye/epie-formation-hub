
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Props pour le composant Layout
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Composant Layout - Structure principale de l'application
 * 
 * Combine le header, la sidebar et le contenu principal
 * avec une gestion responsive appropriée
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe en haut */}
      <Header />
      
      {/* Container principal avec sidebar et contenu */}
      <div className="flex">
        {/* Sidebar de navigation */}
        <Sidebar />
        
        {/* Contenu principal */}
        <main className="flex-1 lg:ml-64 p-6 pt-6">
          {/* Container avec largeur maximale et centrage */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
