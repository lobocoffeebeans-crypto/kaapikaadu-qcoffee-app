interface CancelButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const CancelButton = ({ onClick, disabled = false }: CancelButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm
                 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Cancel
    </button>
  );
};

export default CancelButton;