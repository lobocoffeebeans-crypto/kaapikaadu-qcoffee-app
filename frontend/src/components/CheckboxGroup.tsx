import type { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  error?: string;
  registration: UseFormRegisterReturn;
}

const CheckboxGroup = ({ label, options, error, registration }: CheckboxGroupProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50"
          >
            <input
              type="checkbox"
              value={option.value}
              {...registration}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CheckboxGroup;