import { useForm } from 'react-hook-form';
import type { PickingLotFormData } from '../types/PickingLot';
import { DEFAULT_LANGUAGE } from '../config/appConfig';
import { VALIDATION_MESSAGE_KEYS } from '../constants/pickingLot';
import { getValidationMessage } from '../constants/translations';

export const usePickingLot = () => {
  const today = new Date().toISOString().split('T')[0];
  const language = DEFAULT_LANGUAGE;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PickingLotFormData>({
    mode: 'onTouched',
    defaultValues: {
      harvestDate: '',
      variety: '',
      blocks: [],
      totalCherryWeightKg: 0,
    },
  });

  const validateCherryWeight = (value: number) => {
    if (!value) return getValidationMessage(VALIDATION_MESSAGE_KEYS.WEIGHT_REQUIRED, language);
    if (Number.isNaN(value)) return getValidationMessage(VALIDATION_MESSAGE_KEYS.WEIGHT_NUMERIC, language);
    if (value <= 0) return getValidationMessage(VALIDATION_MESSAGE_KEYS.WEIGHT_GREATER_THAN_ZERO, language);
    return true;
  };

  const validateHarvestDate = (value: string) => {
    if (!value) return getValidationMessage(VALIDATION_MESSAGE_KEYS.HARVEST_DATE_REQUIRED, language);
    if (value > today) return getValidationMessage(VALIDATION_MESSAGE_KEYS.HARVEST_DATE_FUTURE, language);
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
    language,
  };
};