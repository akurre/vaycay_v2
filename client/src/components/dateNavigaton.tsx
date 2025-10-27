import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DateEntryFormProps {
  onSubmit: (formattedDate: string) => void;
}

const DateEntryForm: React.FC<DateEntryFormProps> = ({ onSubmit }) => {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const navigate = useNavigate();

  // Function to generate options for days based on selected month
  const generateDaysOptions = (selectedMonth: string) => {
    const numberOfDays = new Date(2022, parseInt(selectedMonth, 10), 0).getDate();
    const daysOptions = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const dayFormatted = i.toString().padStart(2, '0');
      daysOptions.push(<option key={dayFormatted} value={dayFormatted}>{dayFormatted}</option>);
    }

    return daysOptions;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formattedDate = `${month}-${day}`;
    onSubmit(formattedDate);
    navigate(`/day/${formattedDate}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded-md"
        required
      >
        <option value="">Month</option>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <select
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border p-2 rounded-md ml-4"
        required
      >
        <option value="">Day</option>
        {month && generateDaysOptions(month)}
      </select>
      <button
        type="submit"
        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get Weather
      </button>
    </form>
  );
};

export default DateEntryForm;
