import { LanguageSelectionForm } from './LanguageSelectionForm';

interface TranslationFormProps {
  isLoading: boolean;
  translateFrom: string;
  translateTo: string;
  onTranslateFromChange: (val: string) => void;
  onTranslateToChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TranslationForm: React.FC<TranslationFormProps> = ({
  isLoading, translateFrom, translateTo, onTranslateFromChange, onTranslateToChange, onSubmit
}) => (
  <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Subtitle Translation</h2>
    <div className="flex flex-row gap-4">
      <LanguageSelectionForm
        label="Translate From:"
        detect={true}
        value={translateFrom}
        onValueChange={onTranslateFromChange}
      />
      <LanguageSelectionForm
        label="Translate To:"
        value={translateTo}
        onValueChange={onTranslateToChange}
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={isLoading || !translateFrom || !translateTo}
      className={`w-full mt-4 py-2 px-4 rounded-md text-white font-medium
        ${isLoading || !translateFrom || !translateTo
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'}`}
    >
      {isLoading ? 'Processing...' : 'Translate'}
    </button>
  </div>
);
