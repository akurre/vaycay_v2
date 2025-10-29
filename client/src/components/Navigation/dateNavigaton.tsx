import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Button } from '@mantine/core';
import { monthOptions } from '../../utils/monthOptions';
import { generateDaysOptions } from '../../utils/generateDaysOptions';

interface DateEntryFormProps {
  onSubmit: (formattedDate: string) => void;
}

const DateEntryForm: React.FC<DateEntryFormProps> = ({ onSubmit }) => {
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
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
      <div className='mt-xl'>
        <Select
          placeholder="Month"
          data={monthOptions}
          value={month}
          onChange={setMonth}
          required
          searchable
        />
        <Select
          placeholder="Day"
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
