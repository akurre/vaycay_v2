import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import Field from '../../../components/Map/CityPopup/Field'; // todo fix formatting

describe('Field', () => {
  it('renders label and value correctly', () => {
    render(<Field label="Temperature" value="25.5°C" />);

    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<Field label="Humidity" value={75} />);

    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('applies monospace font when specified', () => {
    render(<Field label="Coordinates" value="45.5, 9.2" monospace />);

    const valueElement = screen.getByText('45.5, 9.2');
    expect(valueElement).toBeInTheDocument();
  });

  it('renders without monospace by default', () => {
    render(<Field label="City" value="Milan" />);

    const valueElement = screen.getByText('Milan');
    expect(valueElement).toBeInTheDocument();
  });

  it('handles empty string value', () => {
    render(<Field label="Notes" value="" />);

    expect(screen.getByText('Notes')).toBeInTheDocument();
  });
});
