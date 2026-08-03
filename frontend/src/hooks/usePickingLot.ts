import { useForm } from 'react-hook-form';
import type { PickingLotFormData } from '../types/PickingLot';

export const usePickingLot = () => {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PickingLotFormData>({
    mode: 'onBlur',
    defaultValues: {
      harvestDate: '',
      block: '',
      variety: '',
      process: '',
      cherryWeight: 0,
    },
  });

  const validateCherryWeight = (value: number) => {
    if (value <= 0) return 'Cherry Weight must be greater than zero';
    return true;
  };

  const validateHarvestDate = (value: string) => {
    if (!value) return 'Harvest Date is required';
    if (value > today) return 'Harvest Date cannot be in the future';
    return true;
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    reset,
    validateCherryWeight,
    validateHarvestDate,
    today,
  };
};