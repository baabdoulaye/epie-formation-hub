
# EPIE Connect - Intranet de Gestion

## 📋 Description du Projet

EPIE Connect est une application web intranet moderne développée pour EPIE Formation. Cette plateforme centralisée permet aux employés d'accéder rapidement aux données opérationnelles clés, de visualiser des indicateurs de performance et de gérer les informations essentielles du centre de formation.

## 🎯 Objectifs Principaux

- **Centralisation des données** : Une plateforme unique pour toutes les informations importantes
- **Tableau de bord dynamique** : Visualisation en temps réel des indicateurs clés de performance
- **Gestion simplifiée** : Interface intuitive pour la gestion des stagiaires, formations et employés
- **Sécurité renforcée** : Système d'authentification avec gestion des rôles et permissions

## 👥 Public Cible

Cette application est exclusivement destinée aux employés et à la direction d'EPIE Formation, incluant :
- Administrateurs
- Managers
- Formateurs
- Personnel administratif

## 🚀 Fonctionnalités Principales

### 🔐 Gestion des Utilisateurs
- **Création de compte** : Inscription sécurisée avec email/mot de passe
- **Authentification** : Connexion/déconnexion sécurisées
- **Réinitialisation de mot de passe** : Processus "Mot de passe oublié"
- **Gestion de profil** : Modification des informations personnelles
- **Système de rôles** : Administrateur, Manager, Formateur, Employé

### 📊 Tableaux de Bord Dynamiques
- **Vue d'ensemble** : Chiffres clés et statistiques principales
- **Statistiques Stagiaires** : 
  - Nombre total de stagiaires actifs
  - Répartition par session et formation
  - Graphiques de progression
- **Statistiques Formations** :
  - Sessions en cours, à venir, terminées
  - Taux de réussite et d'abandon
- **Statistiques Personnel** : Répartition par département et rôle
- **Statistiques Partenaires** : Partenaires actifs par type

### 🛠️ Gestion des Données (CRUD)

#### Stagiaires
- Inscription de nouveaux stagiaires
- Modification des informations personnelles
- Suppression de profils
- Historique des formations
- Suivi de progression

#### Formations et Sessions
- Création de nouvelles formations
- Planification des sessions
- Attribution des formateurs superviseurs
- Modification des détails existants

#### Employés (Admin uniquement)
- Ajout/modification/suppression des comptes
- Gestion des rôles et permissions

#### Partenaires
- Gestion complète des informations partenaires

### 📈 Reporting et Export
- Génération de rapports personnalisables
- Export vers CSV, Excel, PDF
- Analyses et archives

### 📁 Gestion Documentaire
- Upload de documents (contrats, supports, attestations)
- Liaison avec les fiches stagiaires/formations
- Accès et téléchargement sécurisés

### 📅 Calendrier Intégré
- Affichage des sessions de formation
- Échéances importantes
- Filtrage par formation, formateur, type

### 🔍 Recherche et Filtrage
- Recherche avancée multi-critères
- Filtres pour affiner les vues
- Navigation rapide

## 🎓 Types de Formations Gérés

### Formations Numériques
- Parcours Sécurisé vers les métiers de l'informatique et du numérique
- Parcours d'Accès à la Qualification aux métiers de l'informatique et du numérique
- TP – Technicien(ne) d'Assistance Informatique
- TP – Technicien(ne) Supérieur Système et Réseaux
- TP – Technicien(ne) Réseaux IP

### Formations Socles de Compétences
- Compétences de bases professionnelles
- Formation et Certification Cléa
- Parcours Sécurisé vers les métiers de l'Accueil et du Secrétariat
- Web Inclusion Numérique pour l'emploi

### Formations Linguistiques
- ALPHABETISATION
- FRANÇAIS LANGUE ÉTRANGÉRE
- Remise à niveau

## 🛠️ Stack Technique

### Frontend
- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **Shadcn/ui** : Composants UI modernes
- **Lucide React** : Icônes
- **React Router** : Navigation
- **React Query** : Gestion d'état et cache

### Backend (À implémenter)
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification
- **Bcrypt** : Hachage des mots de passe

### Outils de Développement
- **Vite** : Build tool
- **ESLint** : Linting
- **Prettier** : Formatage du code

## 🎨 Design System

### Charte Graphique EPIE Formation
- **Vert EPIE** : #d3d92b
- **Bleu EPIE** : #0077bc
- **Variantes** : Tons clairs et foncés pour la hiérarchie visuelle

### Principes de Design
- **Minimalisme** : Interface épurée et moderne
- **Flat Design** : Style plat contemporain
- **Whitespace** : Utilisation intelligente de l'espace blanc
- **Responsive** : Adaptation à tous les écrans
- **Animations fluides** : Transitions douces et naturelles

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Desktop** : Écrans larges (1200px+)
- **Tablettes** : Écrans moyens (768px - 1199px)
- **Mobiles** : Écrans petits (< 768px)

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Git

### Installation
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd epie-connect

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Variables d'Environnement
Créer un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=EPIE Connect
```

## 📂 Structure du Projet

```
src/
├── components/          # Composants React réutilisables
│   ├── ui/             # Composants UI de base (shadcn)
│   ├── forms/          # Composants de formulaires
│   ├── charts/         # Composants de graphiques
│   └── layout/         # Composants de mise en page
├── pages/              # Pages principales de l'application
│   ├── auth/           # Pages d'authentification
│   ├── dashboard/      # Tableaux de bord
│   ├── students/       # Gestion des stagiaires
│   ├── trainings/      # Gestion des formations
│   ├── employees/      # Gestion des employés
│   └── partners/       # Gestion des partenaires
├── hooks/              # Hooks React personnalisés
├── lib/                # Utilitaires et helpers
├── types/              # Définitions TypeScript
├── context/            # Contextes React (authentification, etc.)
└── assets/             # Images, icônes, etc.
```

## 🔒 Sécurité

### Mesures Implémentées
- **Authentification JWT** : Tokens sécurisés
- **Hachage des mots de passe** : Bcrypt avec salt
- **Validation des données** : Côté client et serveur
- **Protection CSRF** : Tokens anti-forgery
- **Gestion des rôles** : Contrôle d'accès basé sur les rôles (RBAC)

### Bonnes Pratiques
- Validation stricte des entrées utilisateur
- Sanitisation des données
- Chiffrement des données sensibles
- Audit des accès et actions

## 📊 Base de Données MongoDB

### Collections Principales
```javascript
// Utilisateurs (Employés)
users: {
  _id: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String, // 'admin', 'manager', 'trainer', 'employee'
  department: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Stagiaires
students: {
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  birthDate: Date,
  address: Object,
  trainings: [ObjectId], // Références aux formations
  status: String,
  createdAt: Date,
  updatedAt: Date
}

// Formations
trainings: {
  _id: ObjectId,
  name: String,
  category: String,
  description: String,
  duration: Number,
  supervisors: [ObjectId], // Références aux formateurs
  sessions: [Object],
  students: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Partenaires
partners: {
  _id: ObjectId,
  name: String,
  type: String,
  contactInfo: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Déploiement

### Environnements
- **Développement** : Local avec Vite dev server
- **Staging** : Serveur de test
- **Production** : Serveur de production

### Processus de Déploiement
1. Tests automatisés
2. Build de production
3. Déploiement automatique
4. Vérification post-déploiement

## 🤝 Contribution

### Standards de Code
- **ESLint** : Respect des règles de linting
- **Prettier** : Formatage automatique
- **Conventions** : Nommage cohérent des variables et fonctions
- **Commentaires** : Documentation du code complexe

### Workflow Git
```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Commit avec message descriptif
git commit -m "feat: ajout de la gestion des formations"

# Push et création de Pull Request
git push origin feature/nouvelle-fonctionnalite
```

## 📞 Support et Contact

### Équipe de Développement
- **Lead Developer** : [Nom]
- **UI/UX Designer** : [Nom]
- **Backend Developer** : [Nom]

### Documentation Technique
- API Documentation : `/docs/api`
- Component Library : `/docs/components`
- Database Schema : `/docs/database`

## 🔮 Roadmap

### Version 1.0 (MVP)
- [x] Interface utilisateur de base
- [x] Système d'authentification
- [x] Tableaux de bord principaux
- [ ] Gestion CRUD complète
- [ ] API Backend

### Version 1.1
- [ ] Système de notifications
- [ ] Export avancé de données
- [ ] Gestion documentaire
- [ ] Calendrier intégré

### Version 1.2
- [ ] Application mobile
- [ ] Intégrations externes
- [ ] Analytics avancés
- [ ] Notifications push

## 📄 Licence

Ce projet est propriétaire d'EPIE Formation. Tous droits réservés.

---

**EPIE Connect** - Intranet de Gestion Moderne pour EPIE Formation
```

Développé avec ❤️ pour EPIE Formation
```
