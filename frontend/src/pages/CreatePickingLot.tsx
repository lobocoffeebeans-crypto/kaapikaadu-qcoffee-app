import { useState } from 'react';
import TextField from '../components/TextField';
import Dropdown from '../components/Dropdown';
import CheckboxGroup from '../components/CheckboxGroup';
import SaveButton from '../components/SaveButton';
import CancelButton from '../components/CancelButton';
import { usePickingLot } from '../hooks/usePickingLot';
import { pickingLotService } from '../services/pickingLotService';
import { masterDataService } from '../services/masterDataService';
import { VALIDATION_MESSAGE_KEYS } from '../constants/pickingLot';
import { getValidationMessage } from '../constants/translations';
import type { PickingLotFormData, CreatePickingLotRequest } from '../types/PickingLot';

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

  const [isSaving, setIsSaving] = useState(false);
  const [successLotId, setSuccessLotId] = useState<string | null>(null);

  const blockOptions = masterDataService.getBlocks();
  const varietyOptions = masterDataService.getVarieties();

  const onSubmit = async (data: PickingLotFormData) => {
    setIsSaving(true);
    try {
      const request: CreatePickingLotRequest = {
        harvestDate: data.harvestDate,
        varietyCode: data.variety,
        totalCherryWeightKg: data.totalCherryWeightKg,
        blockCodes: data.blocks,
      };
      const response = await pickingLotService.createPickingLot(request);
      setSuccessLotId(response.lotId);
      reset({
        harvestDate: today,
        variety: '',
        blocks: [],
        totalCherryWeightKg: 0,
      });
    } catch {
      // Out of scope: network/error handling. Keep form intact.
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    reset({
      harvestDate: today,
      variety: '',
      blocks: [],
      totalCherryWeightKg: 0,
    });
  };

  const onCloseSuccess = () => {
    setSuccessLotId(null);
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
            <SaveButton disabled={!isValid} loading={isSaving} />
            <CancelButton onClick={onCancel} disabled={isSaving} />
          </div>
        </form>
      </div>

      {successLotId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h2 id="success-title" className="text-lg font-semibold text-gray-900 mb-2">
                Picking Lot Created
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Lot ID: <span className="font-medium text-gray-900">{successLotId}</span>
              </p>
              <button
                type="button"
                onClick={onCloseSuccess}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg text-sm
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePickingLot;