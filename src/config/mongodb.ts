
/**
 * Configuration MongoDB pour EPIE Connect
 */

export const MONGODB_CONFIG = {
  // Configuration de connexion MongoDB
  connection: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/epie-connect',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  
  // Noms des collections
  collections: {
    employees: 'employees',
    students: 'students',
    trainings: 'trainings',
    sessions: 'sessions',
    internships: 'internships',
  },
  
  // Paramètres généraux
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // Validation des données
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telephone: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    codePostal: /^\d{5}$/,
  },
};

/**
 * Utilitaires pour la validation des données
 */
export const validateData = {
  email: (email: string): boolean => MONGODB_CONFIG.validation.email.test(email),
  telephone: (tel: string): boolean => MONGODB_CONFIG.validation.telephone.test(tel),
  codePostal: (code: string): boolean => MONGODB_CONFIG.validation.codePostal.test(code),
};
