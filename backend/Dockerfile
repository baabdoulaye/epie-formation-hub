# backend/Dockerfile

# Étape 1: Utiliser une image de base Node.js
# On prend la version 20 (latest stable LTS)
FROM node:20-alpine3.19

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier les fichiers de définition de dépendances (package.json, package-lock.json)
# Ceci permet à Docker de cacher cette étape et de ne réinstaller les dépendances que si ces fichiers changent
COPY package*.json ./

# Étape 4: Installer les dépendances du backend
# On utilise --production pour n'installer que les dépendances nécessaires au runtime
# (pas les devDependencies)
RUN npm install --production && npm cache clean --force

# Étape 5: Copier tout le code source du backend dans le conteneur
COPY . .

# Étape 6: Exposer le port sur lequel le serveur Node.js écoute
# C'est le PORT que tu as défini dans ton backend/server.js (5000 par défaut)
EXPOSE 5000

RUN adduser -D appuser
USER appuser

# Étape 7: Commande à exécuter quand le conteneur démarre
# Lance ton serveur Node.js
CMD ["node", "server.js"]