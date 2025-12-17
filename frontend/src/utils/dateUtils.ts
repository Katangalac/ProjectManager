import { getOrdinalSuffix } from "./stringUtils";
import { MONTHS } from "@/lib/constants/date";

export const dateToLongString = (date: Date): string => {
  const dateNumber = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const dateString = `${MONTHS[monthIndex]} the ${dateNumber}${getOrdinalSuffix(dateNumber)}, ${year}`;
  return dateString;
};

export const timeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "In the future";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }

  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  if (weeks < 4) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  // ≥ 1 month → return the date
  return `Since ${dateToLongString(date)}`;
};
