
import { Training } from '@/types/database';

/**
 * Service pour la gestion des formations
 */
export class TrainingService {
  private static readonly STORAGE_KEY = 'epie_trainings';

  /**
   * Récupère toutes les formations
   */
  static async getAllTrainings(): Promise<Training[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultTrainings();
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      return this.getDefaultTrainings();
    }
  }

  /**
   * Crée une nouvelle formation
   */
  static async createTraining(trainingData: Omit<Training, 'id' | 'created_at' | 'updated_at'>): Promise<Training> {
    try {
      const trainings = await this.getAllTrainings();
      const newTraining: Training = {
        ...trainingData,
        id: this.generateId(),
        objectifs: [],
        prerequis: [],
        statut: 'Actif',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      trainings.push(newTraining);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainings));
      
      return newTraining;
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une formation
   */
  static async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    try {
      const trainings = await this.getAllTrainings();
      const index = trainings.findIndex(training => training.id === id);
      
      if (index === -1) {
        throw new Error('Formation non trouvée');
      }
      
      trainings[index] = {
        ...trainings[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainings));
      return trainings[index];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
      throw error;
    }
  }

  /**
   * Recherche des formations
   */
  static async searchTrainings(searchTerm: string): Promise<Training[]> {
    try {
      const trainings = await this.getAllTrainings();
      const term = searchTerm.toLowerCase();
      
      return trainings.filter(training => 
        training.title.toLowerCase().includes(term) ||
        training.description.toLowerCase().includes(term) ||
        training.category.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Erreur lors de la recherche de formations:', error);
      return [];
    }
  }

  /**
   * Génère un ID unique
   */
  private static generateId(): string {
    return 'training_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Données par défaut pour les formations
   */
  private static getDefaultTrainings(): Training[] {
    return [
      {
        id: 'training_1',
        title: 'Initiation à l\'informatique',
        category: 'numerique',
        duration: 40,
        description: 'Formation d\'initiation aux outils informatiques de base',
        objectifs: ['Maîtriser les bases de l\'informatique', 'Utiliser les logiciels bureautiques'],
        prerequis: ['Aucun prérequis'],
        statut: 'Actif',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'training_2',
        title: 'Français Langue Étrangère',
        category: 'linguistique',
        duration: 120,
        description: 'Apprentissage du français pour les non-francophones',
        objectifs: ['Communiquer en français', 'Comprendre les documents administratifs'],
        prerequis: ['Niveau débutant accepté'],
        statut: 'Actif',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }
}
