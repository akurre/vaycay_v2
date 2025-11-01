import { SegmentedControl, Tooltip } from '@mantine/core';
import { IconChartBubble, IconMapPin } from '@tabler/icons-react';
import { appColors } from '@/theme';

type ViewMode = 'heatmap' | 'markers';

interface MapViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MapViewToggle = ({ viewMode, onViewModeChange }: MapViewToggleProps) => {
  return (
    <SegmentedControl
      value={viewMode}
      color={appColors.primary}
      transitionDuration={300}
      onChange={(value) => onViewModeChange(value as ViewMode)}
      data={[
        {
          value: 'markers',
          label: (
            <Tooltip label="Marker View" withArrow>
              <div className="flex items-center justify-center">
                <IconMapPin size={16} />
              </div>
            </Tooltip>
          ),
        },
        {
          value: 'heatmap',
          label: (
            <Tooltip label="Heatmap View" withArrow>
              <div className="flex items-center justify-center">
                <IconChartBubble size={16} />
              </div>
            </Tooltip>
          ),
        },
      ]}
    />
  );
};

export default MapViewToggle;
