import Field from './Field';

interface LocationSectionProps {
  lat: number | null;
  long: number | null;
}

const LocationSection = ({ lat, long }: LocationSectionProps) => {
  if (lat === null || long === null) return null;

  return (
    <div className="border-t border-gray-200 pt-3">
      <Field
        label="Coordinates"
        value={`${lat.toFixed(4)}°, ${long.toFixed(4)}°`}
        monospace
      />
    </div>
  );
};

export default LocationSection;
