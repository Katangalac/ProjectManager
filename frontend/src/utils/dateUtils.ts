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
