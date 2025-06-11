
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Calendar, AlertCircle } from "lucide-react";

/**
 * Composant NotificationPanel - Gestion des notifications
 */
const NotificationPanel: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'nouveau',
      icon: User,
      title: 'Nouveau stagiaire',
      message: 'Sophie Martin vient de s\'inscrire',
      time: 'Il y a 5 min'
    },
    {
      id: 2,
      type: 'visite',
      icon: Calendar,
      title: 'Visite de stage',
      message: 'Visite programmée chez TechCorp demain',
      time: 'Il y a 1h'
    },
    {
      id: 3,
      type: 'alerte',
      icon: AlertCircle,
      title: 'Document manquant',
      message: 'Convention de stage à compléter',
      time: 'Il y a 2h'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          {/* Badge de notification */}
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-xs text-gray-500">{notifications.length} nouvelles</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <DropdownMenuItem key={notification.id} className="cursor-pointer p-3">
              <div className="flex items-start space-x-3 w-full">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-center text-blue-600">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationPanel;
