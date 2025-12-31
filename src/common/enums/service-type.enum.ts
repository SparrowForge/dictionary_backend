export enum ServiceType {
  PHYSIO = 'physio',
  WORKOUT = 'workout',
  BOTH = 'both',
}

export const ServiceTypeEnum = {
  PHYSIO: ServiceType.PHYSIO,
  WORKOUT: ServiceType.WORKOUT,
  BOTH: ServiceType.BOTH,
};

export const ServiceTypeData = [
  { lable: 'Physio', value: ServiceType.PHYSIO },
  { lable: 'Workout', value: ServiceType.WORKOUT },
  { lable: 'Both', value: ServiceType.BOTH },
];
