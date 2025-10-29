import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Button } from '@mantine/core';
import { monthOptions } from '../../utils/monthOptions';
import { generateDaysOptions } from '../../utils/generateDaysOptions';
import { getMonthLabel } from './utils/getMonthLabel';
import { getDayLabel } from './utils/getDayLabel';

interface DateEntryFormProps {
  onSubmit: (formattedDate: string) => void;
  currentDate?: string;
}

const DateEntryForm = ({ onSubmit, currentDate }: DateEntryFormProps) => {
  const [month, setMonth] = useState<string | null>(currentDate ? currentDate.slice(0, 2) : null);
  const [day, setDay] = useState<string | null>(currentDate ? currentDate.slice(2, 4) : null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (month && day) {
      const formattedDate = `${month}${day}`;
      onSubmit(formattedDate);
      navigate(`/day/${formattedDate}`);
    }
  };

  const dayOptions = month ? generateDaysOptions(month) : [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Select
          placeholder={getMonthLabel(month)}
          data={monthOptions}
          value={month}
          onChange={setMonth}
          required
          searchable
        />
        <Select
          placeholder={getDayLabel(day)}
          data={dayOptions}
          value={day}
          onChange={setDay}
          required
          disabled={!month}
          searchable
        />
        <Button type="submit" disabled={!month || !day}>
          Get Weather
        </Button>
      </div>
    </form>
  );
};

export default DateEntryForm;
