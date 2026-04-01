import { CleaningType } from "@/types";

export const CLEANING_TYPES: CleaningType[] = [
  "Sweep",
  "Mop",
  "Wipe",
  "Deep clean",
  "Vacuum",
  "Dust",
  "General",
];

export const STATUS_COLORS = {
  clean: "#86efac",
  due: "#fcd34d",
  overdue: "#f87171",
  never: "#d1d5db",
};

export const STATUS_LABELS = {
  clean: "Clean",
  due: "Due soon",
  overdue: "Overdue",
  never: "Never logged",
};