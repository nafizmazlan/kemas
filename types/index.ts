export type CleaningType =
  | "Sweep"
  | "Mop"
  | "Wipe"
  | "Deep clean"
  | "Vacuum"
  | "Dust"
  | "General";

export type RoomStatus = "clean" | "due" | "overdue" | "never";

export interface Room {
  id: string;
  name: string;
  floor: 1 | 2;
  clean_interval_days: number;
  created_at?: string;
}

export interface CleaningLog {
  id: string;
  room_id: string;
  cleaned_at: string;
  cleaning_type: CleaningType;
  notes?: string | null;
  created_at?: string;
}

export interface RoomWithLastLog extends Room {
  lastLog: CleaningLog | null;
  status: RoomStatus;
  daysSince: number | null;
}