
import { Employee } from '@/types/database';

/**
 * Service pour la gestion des employés
 */
export class EmployeeService {
  private static readonly STORAGE_KEY = 'epie_employees';

  /**
   * Récupère tous les employés
   */
  static async getAllEmployees(): Promise<Employee[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultEmployees();
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      return this.getDefaultEmployees();
    }
  }

  /**
   * Ajoute un nouvel employé
   */
  static async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    try {
      const employees = await this.getAllEmployees();
      const newEmployee: Employee = {
        ...employeeData,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      employees.push(newEmployee);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
      
      return newEmployee;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }
  }

  /**
   * Met à jour un employé existant
   */
  static async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const employees = await this.getAllEmployees();
      const index = employees.findIndex(emp => emp.id === id);
      
      if (index === -1) {
        throw new Error('Employé non trouvé');
      }
      
      employees[index] = {
        ...employees[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
      return employees[index];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      throw error;
    }
  }

  /**
   * Supprime un employé
   */
  static async deleteEmployee(id: string): Promise<void> {
    try {
      const employees = await this.getAllEmployees();
      const filteredEmployees = employees.filter(emp => emp.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEmployees));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      throw error;
    }
  }

  /**
   * Recherche des employés par terme
   */
  static async searchEmployees(searchTerm: string): Promise<Employee[]> {
    try {
      const employees = await this.getAllEmployees();
      const term = searchTerm.toLowerCase();
      
      return employees.filter(emp => 
        emp.nom.toLowerCase().includes(term) ||
        emp.prenom.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.poste.toLowerCase().includes(term) ||
        emp.service.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Erreur lors de la recherche d\'employés:', error);
      return [];
    }
  }

  /**
   * Génère un ID unique
   */
  private static generateId(): string {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Données par défaut pour les employés
   */
  private static getDefaultEmployees(): Employee[] {
    return [
      {
        id: 'emp_1',
        civilite: 'Mme',
        nom: 'Dubois',
        prenom: 'Marie',
        poste: 'Directrice',
        service: 'Direction',
        email: 'marie.dubois@epie.fr',
        telephone: '01 23 45 67 89',
        statut: 'Actif',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'emp_2',
        civilite: 'M.',
        nom: 'Martin',
        prenom: 'Pierre',
        poste: 'Formateur',
        service: 'Pédagogie',
        email: 'pierre.martin@epie.fr',
        telephone: '01 23 45 67 90',
        statut: 'Actif',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'emp_3',
        civilite: 'Mme',
        nom: 'Leroy',
        prenom: 'Sophie',
        poste: 'Coordinatrice',
        service: 'Administration',
        email: 'sophie.leroy@epie.fr',
        telephone: '01 23 45 67 91',
        statut: 'Congé',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }
}
