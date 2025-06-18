
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeService } from '@/services/employeeService';
import { Employee } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: EmployeeService.getAllEmployees,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: EmployeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Succès",
        description: "Employé créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'employé",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Employee> }) =>
      EmployeeService.updateEmployee(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Succès",
        description: "Employé mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'employé",
        variant: "destructive",
      });
    },
  });
};

export const useSearchEmployees = (searchTerm: string) => {
  return useQuery({
    queryKey: ['employees', 'search', searchTerm],
    queryFn: () => EmployeeService.searchEmployees(searchTerm),
    enabled: searchTerm.length > 0,
  });
};
