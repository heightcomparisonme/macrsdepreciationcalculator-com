export enum MoonPhase {
  NEW_MOON = "new_moon",
  WAXING_CRESCENT = "waxing_crescent",
  FIRST_QUARTER = "first_quarter",
  WAXING_GIBBOUS = "waxing_gibbous",
  FULL_MOON = "full_moon",
  WANING_GIBBOUS = "waning_gibbous",
  LAST_QUARTER = "last_quarter",
  WANING_CRESCENT = "waning_crescent",
}

export interface MoonPhaseData {
  date: string;
  phase: MoonPhase;
  phaseAngle: number;
  illumination: number;
  isWaxing: boolean;
  moonLongitude: number;
  moonLatitude: number;
  sunLongitude: number;
}

export interface MoonCalendarDay {
  date: Date;
  phase: MoonPhase;
  illumination: number;
  isWaxing: boolean;
  recommendations?: string[];
}

export interface MoonPhaseEmoji {
  [key: string]: string;
}

export const MOON_PHASE_EMOJIS: MoonPhaseEmoji = {
  [MoonPhase.NEW_MOON]: "🌑",
  [MoonPhase.WAXING_CRESCENT]: "🌒",
  [MoonPhase.FIRST_QUARTER]: "🌓",
  [MoonPhase.WAXING_GIBBOUS]: "🌔",
  [MoonPhase.FULL_MOON]: "🌕",
  [MoonPhase.WANING_GIBBOUS]: "🌖",
  [MoonPhase.LAST_QUARTER]: "🌗",
  [MoonPhase.WANING_CRESCENT]: "🌘",
};
