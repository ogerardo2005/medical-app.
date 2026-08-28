/**
 * SQLite's datetime('now') returns UTC without a timezone suffix
 * (e.g. "2026-08-28 10:15:00"), so it must be marked as UTC explicitly
 * before handing it to Date — otherwise JS parses it as local time.
 */
export function formatUpdatedAt(sqliteDatetime: string): string {
  const date = new Date(`${sqliteDatetime.replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
