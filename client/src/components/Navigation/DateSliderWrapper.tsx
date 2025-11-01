import { FC } from 'react';
import { dateToDayOfYear } from '@/utils/dateFormatting/dateToDayOfYear';
import { dayOfYearToDate } from '@/utils/dateFormatting/dayOfYearToDate';
import { useWeatherStore } from '@/stores/useWeatherStore';
import CustomDateSlider from './CustomDateSlider';

interface DateSliderWrapperProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DateSliderWrapper: FC<DateSliderWrapperProps> = ({ currentDate, onDateChange }) => {
  const { isLoadingWeather } = useWeatherStore();
  const dayOfYear = dateToDayOfYear(currentDate);

  const handleSliderChange = (value: number) => {
    const newDate = dayOfYearToDate(value);
    onDateChange(newDate);
  };

  // month boundaries for labels
  const monthMarks = [
    // todo put into const file
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
      <CustomDateSlider
        value={dayOfYear}
        isLoading={isLoadingWeather}
        onChange={handleSliderChange}
        min={1}
        max={365}
        marks={monthMarks}
      />
    </div>
  );
};

export default DateSliderWrapper;
