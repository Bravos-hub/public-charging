/**
 * Calendar (.ics) Generator
 * Generates a Blob URL for an RFC5545 iCalendar event.
 */

export interface IcsOptions {
  title?: string;
  location?: string;
  description?: string;
  start: string | Date;
  end: string | Date;
}

function formatUtc(d: string | Date): string {
  const x = d instanceof Date ? d : new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = x.getUTCFullYear();
  const mm = pad(x.getUTCMonth() + 1);
  const dd = pad(x.getUTCDate());
  const hh = pad(x.getUTCMinutes() !== x.getUTCMinutes() ? 0 : x.getUTCHours());
  const mi = pad(x.getUTCMinutes());
  const ss = pad(x.getUTCSeconds());
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function escapeText(v = ''): string {
  // Escape backslash, comma, semicolon, and newlines as per RFC5545
  return String(v)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export function makeIcs({
  title = 'EVzone Charging',
  location = '',
  description = '',
  start,
  end,
}: IcsOptions): string {
  const uid = `${Date.now()}@evzone.app`;
  const now = formatUtc(new Date());
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EVzone//Charging//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeText(title)}`,
    location ? `LOCATION:${escapeText(location)}` : '',
    description ? `DESCRIPTION:${escapeText(description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
  return URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
}

