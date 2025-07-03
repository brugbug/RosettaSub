import { SubtitleDropdown } from './SubtitleDropdown';

type VttFile = {
  language: string;
  filename: string;
}

interface SubtitleDropdownProps {
  vttFiles: VttFile[];
  selectedVttFilename: string | null;
  onVttFilenameChange: (val: string) => void;
}

export const SubtitleSelectionForm: React.FC<SubtitleDropdownProps> = ({
  vttFiles,
  selectedVttFilename,
  onVttFilenameChange
}) => (
  <div className="w-full max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-6 bg-blue-50">Subtitle Selection</h3>
    <div className="flex flex-row flex-wrap gap-4">
      <SubtitleDropdown
        vttFiles={vttFiles}
        selectedVttFilename={selectedVttFilename}
        onSelectedVttFilenameChange={onVttFilenameChange}
      />
    </div>
  </div>
);