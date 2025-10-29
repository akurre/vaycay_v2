import { monthOptions } from '../../../utils/monthOptions';

export const getMonthLabel = (monthValue: string | null): string => {
  if (!monthValue) return 'Month';
  const monthOption = monthOptions.find((opt) => opt.value === monthValue);
  return monthOption ? monthOption.label : 'Month';
};
