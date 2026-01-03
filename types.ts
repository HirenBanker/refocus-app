
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  isLoggedIn: boolean;
}

export interface BlockConfig {
  id: string;
  sites: string[];
  duration: number | 'custom';
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export enum BlockDuration {
  ONE_HOUR = 1,
  TWO_HOURS = 2,
  THREE_HOURS = 3,
  FOUR_HOURS = 4,
  CUSTOM = 'custom'
}
