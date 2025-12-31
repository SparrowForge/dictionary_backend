export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

export const SlotStatusEnum = {
  AVAILABLE: SlotStatus.AVAILABLE,
  BOOKED: SlotStatus.BOOKED,
};

export const SlotStatusData = [
  { lable: 'Available', value: SlotStatus.AVAILABLE },
  { lable: 'Booked', value: SlotStatus.BOOKED },
];
