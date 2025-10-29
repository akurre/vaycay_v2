import { Button } from '@mantine/core';

type ViewMode = 'heatmap' | 'markers';

interface MapViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MapViewToggle = ({ viewMode, onViewModeChange }: MapViewToggleProps) => {
  return (
    <div className="flex justify-between gap-2">
      <Button
        size="sm"
        variant={viewMode === 'heatmap' ? 'filled' : 'outline'}
        onClick={() => onViewModeChange('heatmap')}
      >
        Heatmap
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'markers' ? 'filled' : 'outline'}
        onClick={() => onViewModeChange('markers')}
      >
        Markers
      </Button>
    </div>
  );
};

export default MapViewToggle;
