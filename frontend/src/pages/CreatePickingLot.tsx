import TextField from '../components/TextField';
import Dropdown from '../components/Dropdown';
import CheckboxGroup from '../components/CheckboxGroup';
import SaveButton from '../components/SaveButton';
import CancelButton from '../components/CancelButton';
import { usePickingLot } from '../hooks/usePickingLot';
import { createPickingLot } from '../services/pickingLotService';
import { masterDataService } from '../services/masterDataService';
import { VALIDATION_MESSAGE_KEYS } from '../constants/pickingLot';
import { getValidationMessage } from '../constants/translations';
import type { PickingLotFormData } from '../types/PickingLot';

const CreatePickingLot = () => {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    reset,
    validateCherryWeight,
    validateHarvestDate,
    today,
    language,
  } = usePickingLot();

  const blockOptions = masterDataService.getBlocks();
  const varietyOptions = masterDataService.getVarieties();

  const onSubmit = (data: PickingLotFormData) => {
    createPickingLot(data);
    reset({
      harvestDate: today,
      variety: '',
      blocks: [],
      totalCherryWeightKg: 0,
    });
  };

  const onCancel = () => {
    reset({
      harvestDate: today,
      variety: '',
      blocks: [],
      totalCherryWeightKg: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          New Picking Lot
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Harvest Date"
            type="date"
            max={today}
            error={errors.harvestDate?.message}
            registration={register('harvestDate', {
              required: getValidationMessage(VALIDATION_MESSAGE_KEYS.HARVEST_DATE_REQUIRED, language),
              validate: validateHarvestDate,
            })}
          />

          <Dropdown
            label="Variety"
            options={varietyOptions}
            placeholder="Select Variety"
            error={errors.variety?.message}
            registration={register('variety', {
              required: getValidationMessage(VALIDATION_MESSAGE_KEYS.VARIETY_REQUIRED, language),
            })}
          />

          <CheckboxGroup
            label="Blocks"
            options={blockOptions}
            error={errors.blocks?.message}
            registration={register('blocks', {
              required: getValidationMessage(VALIDATION_MESSAGE_KEYS.BLOCK_REQUIRED, language),
              validate: (value: string[]) =>
                value.length > 0 || getValidationMessage(VALIDATION_MESSAGE_KEYS.BLOCK_REQUIRED, language),
            })}
          />

          <TextField
            label="Total Cherry Weight (kg)"
            type="number"
            error={errors.totalCherryWeightKg?.message}
            registration={register('totalCherryWeightKg', {
              required: getValidationMessage(VALIDATION_MESSAGE_KEYS.WEIGHT_REQUIRED, language),
              valueAsNumber: true,
              validate: validateCherryWeight,
            })}
          />

          <div className="mt-6 space-y-3">
            <SaveButton disabled={!isValid} />
            <CancelButton onClick={onCancel} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePickingLot;