export function formatDate(dateString, locale = "ar") {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function pickLocale(row, field, locale) {
  if (!row) return "";
  return row[`${field}_${locale}`] ?? row[`${field}_ar`] ?? row[`${field}_en`] ?? "";
}
