
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Trainings from "./pages/Trainings";
import NotFound from "./pages/NotFound";

/**
 * Configuration du client React Query pour la gestion d'état
 * et la mise en cache des requêtes API
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mise en cache des données pendant 5 minutes
      staleTime: 5 * 60 * 1000,
      // Garde les données en cache pendant 10 minutes après la dernière utilisation
      gcTime: 10 * 60 * 1000,
      // Réessai automatique en cas d'échec de requête
      retry: 1,
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Composant App principal - Point d'entrée de l'application EPIE Connect
 * 
 * Configure les providers globaux et la structure de routage
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil - Tableau de bord */}
          <Route path="/" element={<Index />} />
          
          {/* Gestion des stagiaires */}
          <Route path="/stagiaires" element={<Students />} />
          
          {/* Gestion des formations */}
          <Route path="/formations" element={<Trainings />} />
          
          {/* Pages à ajouter dans les prochaines versions */}
          {/* <Route path="/employes" element={<Employees />} /> */}
          {/* <Route path="/partenaires" element={<Partners />} /> */}
          {/* <Route path="/recherche" element={<Search />} /> */}
          {/* <Route path="/calendrier" element={<Calendar />} /> */}
          {/* <Route path="/profil" element={<Profile />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          
          {/* Route catch-all pour les pages non trouvées */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
