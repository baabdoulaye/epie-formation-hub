
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainingService } from '@/services/trainingService';
import { Training } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useTrainings = () => {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: TrainingService.getAllTrainings,
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: TrainingService.createTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast({
        title: "Succès",
        description: "Formation créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la formation",
        variant: "destructive",
      });
    },
  });
};

export const useSearchTrainings = (searchTerm: string) => {
  return useQuery({
    queryKey: ['trainings', 'search', searchTerm],
    queryFn: () => TrainingService.searchTrainings(searchTerm),
    enabled: searchTerm.length > 0,
  });
};
