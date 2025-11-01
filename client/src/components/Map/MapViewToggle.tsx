import { SegmentedControl } from '@mantine/core';
import { IconChartBubble, IconMapPin } from '@tabler/icons-react';
import TooltipWrapper from '../shared/TooltipWrapper';

type ViewMode = 'heatmap' | 'markers';

interface MapViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MapViewToggle = ({ viewMode, onViewModeChange }: MapViewToggleProps) => {
  return (
    <SegmentedControl
      value={viewMode}
      onChange={(value) => onViewModeChange(value as ViewMode)}
      data={[
        {
          value: 'heatmap',
          label: (
            <div className="flex items-center gap-2">
              <TooltipWrapper label='Heatmap View'>
                <IconChartBubble size={16} />
              </TooltipWrapper>
            </div>
          ),
        },
        {
          value: 'markers',
          label: (
            <div className="flex items-center gap-2">
              <TooltipWrapper label='Marker View'>
                <IconMapPin size={16} />
              </TooltipWrapper>
            </div>
          ),
        },
      ]}
    />
  );
};

export default MapViewToggle;
