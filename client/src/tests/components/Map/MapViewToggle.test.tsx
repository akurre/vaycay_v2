import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils';
import { userEvent } from '@testing-library/user-event';
import MapViewToggle from '@/components/Map/MapViewToggle';

describe('MapViewToggle', () => {
  it('renders both view mode options', () => {
    const mockOnChange = vi.fn();
    render(<MapViewToggle viewMode="heatmap" onViewModeChange={mockOnChange} />);

    expect(screen.getByText('Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Markers')).toBeInTheDocument();
  });

  it('shows heatmap as selected when viewMode is heatmap', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <MapViewToggle viewMode="heatmap" onViewModeChange={mockOnChange} />
    );

    // the segmented control applies data-active attribute to the selected option
    const heatmapButton = container.querySelector('[data-active="true"]');
    expect(heatmapButton).toBeInTheDocument();
    expect(heatmapButton?.textContent).toContain('Heatmap');
  });

  it('shows markers as selected when viewMode is markers', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <MapViewToggle viewMode="markers" onViewModeChange={mockOnChange} />
    );

    // the segmented control applies data-active attribute to the selected option
    const markersButton = container.querySelector('[data-active="true"]');
    expect(markersButton).toBeInTheDocument();
    expect(markersButton?.textContent).toContain('Markers');
  });

  it('calls onViewModeChange with markers when markers option is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<MapViewToggle viewMode="heatmap" onViewModeChange={mockOnChange} />);

    const markersButton = screen.getByText('Markers');
    await user.click(markersButton);

    expect(mockOnChange).toHaveBeenCalledWith('markers');
  });

  it('calls onViewModeChange with heatmap when heatmap option is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<MapViewToggle viewMode="markers" onViewModeChange={mockOnChange} />);

    const heatmapButton = screen.getByText('Heatmap');
    await user.click(heatmapButton);

    expect(mockOnChange).toHaveBeenCalledWith('heatmap');
  });
});
