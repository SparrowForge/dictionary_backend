export enum ExpenseType {
  FEED = 'feed',
  MEDICINE = 'medicine',
  VETERINARY = 'veterinary',
  FARRIER = 'farrier',
  SUPPLEMENTS = 'supplements',
  TRANSPORT = 'transport',
  EQUIPMENT = 'equipment',
  COMPETITION = 'competition',
  OTHER = 'other',
}

export const ExpenseTypeEnum = {
  FEED: ExpenseType.FEED,
  MEDICINE: ExpenseType.MEDICINE,
  VETERINARY: ExpenseType.VETERINARY,
  FARRIER: ExpenseType.FARRIER,
  SUPPLEMENTS: ExpenseType.SUPPLEMENTS,
  TRANSPORT: ExpenseType.TRANSPORT,
  EQUIPMENT: ExpenseType.EQUIPMENT,
  COMPETITION: ExpenseType.COMPETITION,
  OTHER: ExpenseType.OTHER,
};

export const ExpenseTypeData = [
  { lable: 'Feed', value: ExpenseType.FEED },
  { lable: 'Medicine', value: ExpenseType.MEDICINE },
  { lable: 'Veterinary', value: ExpenseType.VETERINARY },
  { lable: 'Farrier', value: ExpenseType.FARRIER },
  { lable: 'Supplements', value: ExpenseType.SUPPLEMENTS },
  { lable: 'Transport', value: ExpenseType.TRANSPORT },
  { lable: 'Equipment', value: ExpenseType.EQUIPMENT },
  { lable: 'Competition', value: ExpenseType.COMPETITION },
  { lable: 'Other', value: ExpenseType.OTHER },
];

// ALTER TYPE "expenses_type_enum"
// ADD VALUE 'medicine';
