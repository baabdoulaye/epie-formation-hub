# frontend/Dockerfile

# Étape 1: Utiliser une image de base Node.js pour la construction
FROM node:20-alpine3.19 AS build

# Étape 2: Définir le répertoire de travail
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances pour la construction
COPY package*.json ./

# Étape 4: Installer les dépendances (y compris celles de dev pour la construction)
RUN npm install

# Étape 5: Copier tout le code source du frontend
COPY . .

# Étape 6: Construire l'application frontend (Vite)
# Cela va créer les fichiers statiques optimisés dans un dossier 'dist' (par défaut pour Vite)
RUN npm run build

# Étape 7: Utiliser une image de base légère pour servir l'application statique
# On utilise Nginx, un serveur web très performant et léger
FROM nginx:alpine

# Étape 8: Supprimer les fichiers de configuration par défaut de Nginx
# RUN rm /etc/nginx/conf.d/default.conf    peut-etre qu'il faudra que je décommente cette ligne

# Étape 9: Copier les fichiers de construction de l'étape 'build' vers le serveur Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Étape 10: Copier un fichier de configuration Nginx personnalisé (à créer si besoin)
# Si tu n'as pas de fichier nginx.conf personnalisé, tu peux commenter cette ligne.
# Pour l'instant, on peut s'en passer, car la configuration par défaut de Nginx pour servir du HTML statique est suffisante.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Étape 11: Exposer le port par défaut de Nginx (80)
EXPOSE 80

# Étape 12: Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]