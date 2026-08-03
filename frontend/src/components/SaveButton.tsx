interface SaveButtonProps {
  disabled?: boolean;
  loading?: boolean;
}

const SaveButton = ({ disabled = false, loading = false }: SaveButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg text-sm
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {loading ? 'Saving...' : 'Save'}
    </button>
  );
};

export default SaveButton;