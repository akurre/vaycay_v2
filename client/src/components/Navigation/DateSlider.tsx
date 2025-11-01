import { FC } from 'react';
import { Slider, Text, Loader } from '@mantine/core';
import { dateToDayOfYear } from '@/utils/dateFormatting/dateToDayOfYear';
import { dayOfYearToDate } from '@/utils/dateFormatting/dayOfYearToDate';
import { useWeatherStore } from '@/stores/useWeatherStore';

interface DateSliderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DateSlider: FC<DateSliderProps> = ({ currentDate, onDateChange }) => {
  const { isLoadingWeather } = useWeatherStore();
  const dayOfYear = dateToDayOfYear(currentDate);

  const handleSliderChange = (value: number) => {
    const newDate = dayOfYearToDate(value);
    onDateChange(newDate);
  };

  // month boundaries for labels
  const monthMarks = [ // todo put into const file
    { value: 1, label: 'Jan' },
    { value: 32, label: 'Feb' },
    { value: 60, label: 'Mar' },
    { value: 91, label: 'Apr' },
    { value: 121, label: 'May' },
    { value: 152, label: 'Jun' },
    { value: 182, label: 'Jul' },
    { value: 213, label: 'Aug' },
    { value: 244, label: 'Sep' },
    { value: 274, label: 'Oct' },
    { value: 305, label: 'Nov' },
    { value: 335, label: 'Dec' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Text size="sm" fw={500}>
          Select Date (Day {dayOfYear} of 365)
        </Text>
        {isLoadingWeather && <Loader size="xs" />}
      </div>
      <Slider
        value={dayOfYear}
        onChange={handleSliderChange}
        min={1}
        max={365}
        marks={monthMarks}
        label={(value) => {
          const date = dayOfYearToDate(value);
          const month = date.substring(0, 2);
          const day = date.substring(2, 4);
          return `${month}/${day}`;
        }}
        styles={{
          markLabel: { fontSize: '0.75rem' },
        }}
      />
    </div>
  );
};

export default DateSlider;
