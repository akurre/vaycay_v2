interface MapTooltipProps {
  x: number;
  y: number;
  content: string;
}

const MapTooltip = ({ x, y, content }: MapTooltipProps) => {
  return (
    <div
      className="pointer-events-none absolute z-50 rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg border border-gray-700"
      style={{
        left: x + 10,
        top: y + 10,
      }}
    >
      <div className="whitespace-pre-line">{content}</div>
    </div>
  );
};

export default MapTooltip;
