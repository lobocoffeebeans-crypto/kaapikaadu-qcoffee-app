import TextField from '../components/TextField';
import Dropdown from '../components/Dropdown';
import SaveButton from '../components/SaveButton';
import { usePickingLot } from '../hooks/usePickingLot';
import { createPickingLot } from '../services/pickingLotService';
import { masterDataService } from '../services/masterDataService';
import { processOptions } from '../constants/dropdown';
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
  } = usePickingLot();

  const blockOptions = masterDataService.getBlocks();
  const varietyOptions = masterDataService.getVarieties();

  const onSubmit = (data: PickingLotFormData) => {
    createPickingLot(data);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Create Picking Lot
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Harvest Date"
            type="date"
            max={today}
            error={errors.harvestDate?.message}
            registration={register('harvestDate', {
              required: 'Harvest Date is required',
              validate: validateHarvestDate,
            })}
          />

          <Dropdown
            label="Block"
            options={blockOptions}
            placeholder="Select Block"
            error={errors.block?.message}
            registration={register('block', {
              required: 'Block is required',
            })}
          />

          <Dropdown
            label="Variety"
            options={varietyOptions}
            placeholder="Select Variety"
            error={errors.variety?.message}
            registration={register('variety', {
              required: 'Variety is required',
            })}
          />

          <Dropdown
            label="Process"
            options={processOptions}
            placeholder="Select Process"
            error={errors.process?.message}
            registration={register('process', {
              required: 'Process is required',
            })}
          />

          <TextField
            label="Cherry Weight (kg)"
            type="number"
            error={errors.cherryWeight?.message}
            registration={register('cherryWeight', {
              required: 'Cherry Weight is required',
              valueAsNumber: true,
              validate: validateCherryWeight,
            })}
          />

          <div className="mt-6">
            <SaveButton disabled={!isValid} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePickingLot;