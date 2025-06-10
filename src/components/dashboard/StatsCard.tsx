
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

/**
 * Props pour le composant StatsCard
 */
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
}

/**
 * Composant StatsCard - Carte de statistiques pour le tableau de bord
 * 
 * Affiche une statistique avec icône, titre, valeur et tendance optionnelle
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className
}) => {
  // Définition des couleurs selon la variante
  const colorVariants = {
    blue: {
      bg: 'from-epie-blue/10 to-epie-blue/5',
      icon: 'text-epie-blue',
      accent: 'bg-epie-blue'
    },
    green: {
      bg: 'from-epie-green/10 to-epie-green/5',
      icon: 'text-epie-green-dark',
      accent: 'bg-epie-green'
    },
    purple: {
      bg: 'from-purple-100 to-purple-50',
      icon: 'text-purple-600',
      accent: 'bg-purple-600'
    },
    orange: {
      bg: 'from-orange-100 to-orange-50',
      icon: 'text-orange-600',
      accent: 'bg-orange-600'
    }
  };

  const variant = colorVariants[color];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
      className
    )}>
      {/* Fond dégradé décoratif */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        variant.bg
      )} />
      
      {/* Accent coloré en haut */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        variant.accent
      )} />
      
      {/* Contenu principal */}
      <div className="relative">
        {/* Header avec icône et titre */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm",
            variant.icon
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          {/* Tendance si présente */}
          {trend && (
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <div className={cn(
                "h-2 w-2 rounded-full",
                trend.isPositive ? "bg-green-600" : "bg-red-600"
              )} />
            </div>
          )}
        </div>
        
        {/* Valeur principale */}
        <div className="mb-2">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {title}
          </div>
        </div>
        
        {/* Sous-titre optionnel */}
        {subtitle && (
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
