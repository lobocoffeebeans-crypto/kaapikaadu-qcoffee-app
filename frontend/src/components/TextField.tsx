import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date';
  error?: string;
  registration: UseFormRegisterReturn;
  max?: string;
}

const TextField = ({ label, type = 'text', error, registration, max }: TextFieldProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        max={max}
        {...registration}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextField;