import { getOrdinalSuffix } from "./stringUtils";
import { MONTHS } from "@/lib/constants/date";

export const dateToLongString = (date: Date): string => {
  const dateNumber = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const dateString = `${MONTHS[monthIndex]} the ${dateNumber}${getOrdinalSuffix(dateNumber)}, ${year}`;
  return dateString;
};

export const timeAgo = (date: Date, short: boolean = false): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "In the future";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return short ? `${seconds}s ago` : `${seconds} sec ago`;
  }

  if (minutes < 60) {
    return short ? `${minutes}m ago` : `${minutes} min ago`;
  }

  if (hours < 24) {
    return short ? `${hours}h ago` : `${hours} hour(s) ago`;
  }

  if (days < 7) {
    return short ? `${days}d ago` : `${days} day(s) ago`;
  }

  if (weeks < 4) {
    return short ? `${weeks}w ago` : `${weeks} week(s) ago`;
  }

  // ≥ 1 month → return the date
  return short
    ? `${date.toISOString().split("T")[0]}`
    : `Since ${dateToLongString(date)}`;
};

export const formatShortDateWithOptionalYear = (date: Date): string => {
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  // Format de base : "Jan 14"
  const base = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase()); // met la 1ère lettre en majuscule

  if (isCurrentYear) {
    return base; // ex: "Jan 14"
  }

  return `${base}, ${date.getFullYear()}`; // ex: "Jan 14, 2025"
};

export const formatTime = (date: Date, amPm: boolean): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: amPm,
  });
};
