export const getAcronymeFromName = (name: string) => {
  if (!name) return "";

  // Split avec espace, /, _, -
  const nameParts = name.split(/[ /_-]+/).filter((p) => p.length > 0);

  // Aucun séparateur → un seul bloc
  if (nameParts.length === 1) {
    const part = nameParts[0];

    if (part.length === 1) return part.toUpperCase();
    return (part[0] + part[1]).toUpperCase();
  }

  const first = nameParts[0][0];
  const last = nameParts[nameParts.length - 1][0];
  // Plusieurs parties → première lettre de chacune
  return (first + last).toUpperCase();
};

export const getOrdinalSuffix = (n: number): string => {
  if (n % 100 >= 11 && n % 100 <= 13) {
    return "th";
  }

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
