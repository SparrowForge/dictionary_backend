export enum SettingsType {
  GENERAL = 'general',
  BOOKING = 'booking',
  MEDIA = 'media',
  INVENTORY = 'inventory',
  FINANCE = 'finance',
  SERVICE_LOCATION = 'serviceLocation',
  NOTIFICATIONS = 'notifications',
  PERMISSIONS = 'permissions',
  //mobile----------------------------------------------
  NOTIFICATION_HORSE_CARE = 'notification_horse_care',
  NOTIFICATION_CALENDAR_EVENT = 'notification_calendar_event',
  NOTIFICATION_ATHLETE_WELLNESS = 'notification_athlete_wellness',
  NOTIFICATION_SYSTEM_SECURITY = 'notification_system_security',
  NOTIFICATION_DO_NOT_DISTURB_MODE = 'notification_do_not_disturb_mode',
  NOTIFICATION_SOUND_VIBRATION = 'notification_sound_vibration',
}

export const SettingsTypeEnum = {
  general: SettingsType.GENERAL,
  booking: SettingsType.BOOKING,
  media: SettingsType.MEDIA,
  inventory: SettingsType.INVENTORY,
  finance: SettingsType.FINANCE,
  serviceLocation: SettingsType.SERVICE_LOCATION,
  notifications: SettingsType.NOTIFICATIONS,
  permissions: SettingsType.PERMISSIONS,
  //mobile----------------------------------------------
  notification_horse_care: SettingsType.NOTIFICATION_HORSE_CARE,
  notification_Calendar_Event: SettingsType.NOTIFICATION_CALENDAR_EVENT,
  notification_Athlete_Wellness: SettingsType.NOTIFICATION_ATHLETE_WELLNESS,
  notification_System_Security: SettingsType.NOTIFICATION_SYSTEM_SECURITY,
  notification_Do_Not_Disturb_Mode:
    SettingsType.NOTIFICATION_DO_NOT_DISTURB_MODE,
  notification_Sound_Vibration: SettingsType.NOTIFICATION_SOUND_VIBRATION,
};

// ALTER TYPE "app_settings_type_enum"
//      ADD VALUE 'notification_horse_care';
