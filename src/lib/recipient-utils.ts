export interface AudienceRecipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  eventType: string;
  eventDate: string;
  city: string;
  guestCount: string;
  unsubscribed: boolean;
}

export interface AudienceParseResult {
  recipients: AudienceRecipient[];
  invalidRows: string[];
  duplicateCount: number;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function parseRecipientsCsv(csvText: string): AudienceParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { recipients: [], invalidRows: [], duplicateCount: 0 };
  }

  const header = lines[0].split(",").map((value) => value.trim().toLowerCase());
  const indexByColumn = Object.fromEntries(
    header.map((columnName, index) => [columnName, index]),
  );

  const seenEmails = new Set<string>();
  const recipients: AudienceRecipient[] = [];
  const invalidRows: string[] = [];
  let duplicateCount = 0;

  for (const rawLine of lines.slice(1)) {
    const columns = rawLine.split(",").map((value) => value.trim());
    const email = normalizeEmail(columns[indexByColumn.email ?? -1] ?? "");

    if (!isValidEmail(email)) {
      invalidRows.push(rawLine);
      continue;
    }

    if (seenEmails.has(email)) {
      duplicateCount += 1;
      continue;
    }

    seenEmails.add(email);

    recipients.push({
      id: `${email}-${recipients.length + 1}`,
      email,
      firstName: columns[indexByColumn.firstname ?? indexByColumn.first_name ?? -1] ?? "",
      lastName: columns[indexByColumn.lastname ?? indexByColumn.last_name ?? -1] ?? "",
      eventType: columns[indexByColumn.eventtype ?? indexByColumn.event_type ?? -1] ?? "",
      eventDate: columns[indexByColumn.eventdate ?? indexByColumn.event_date ?? -1] ?? "",
      city: columns[indexByColumn.city ?? -1] ?? "",
      guestCount: columns[indexByColumn.guestcount ?? indexByColumn.guest_count ?? -1] ?? "",
      unsubscribed:
        (columns[indexByColumn.unsubscribed ?? -1] ?? "").toLowerCase() === "true",
    });
  }

  return {
    recipients,
    invalidRows,
    duplicateCount,
  };
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return emailRegex.test(value);
}
