export enum EventType {
  Feed = 'Feed',
  Competition = 'Competition',
  Farrier = 'Farrier',
  Veterinary = 'Veterinary',
  Transport = 'Transport',
}

export const EventTypeEnum = {
  Feed: EventType.Feed,
  Competition: EventType.Competition,
  Farrier: EventType.Farrier,
  Veterinary: EventType.Veterinary,
  Transport: EventType.Transport,
};

export const EventTypeData = [
  { lable: 'Feed', value: EventType.Feed },
  { lable: 'Competition', value: EventType.Competition },
  { lable: 'Farrier', value: EventType.Farrier },
  { lable: 'Veterinary', value: EventType.Veterinary },
  { lable: 'Transport', value: EventType.Transport },
];

// ALTER TYPE "expenses_type_enum"
// ADD VALUE 'Competition';
