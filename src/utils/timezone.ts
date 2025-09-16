// IST Timezone utility functions
// IST is UTC+5:30

export const IST_OFFSET_HOURS = 5.5;
export const IST_OFFSET_MS = IST_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Get current date and time in IST
 */
export function getCurrentIST(): Date {
  const now = new Date();
  return new Date(now.getTime() + IST_OFFSET_MS);
}

/**
 * Convert UTC date to IST
 */
export function utcToIST(utcDate: Date): Date {
  return new Date(utcDate.getTime() + IST_OFFSET_MS);
}

/**
 * Convert IST date to UTC
 */
export function istToUTC(istDate: Date): Date {
  return new Date(istDate.getTime() - IST_OFFSET_MS);
}

/**
 * Format date in IST timezone
 */
export function formatDateIST(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const istDate = utcToIST(date);
  return istDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options
  });
}

/**
 * Format time in IST timezone
 */
export function formatTimeIST(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const istDate = utcToIST(date);
  return istDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options
  });
}

/**
 * Format datetime in IST timezone
 */
export function formatDateTimeIST(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const istDate = utcToIST(date);
  return istDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options
  });
}

/**
 * Get start of day in IST (00:00:00)
 */
export function getISTStartOfDay(date: string | Date): Date {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  return new Date(dateStr + 'T00:00:00+05:30');
}

/**
 * Get end of day in IST (23:59:59.999)
 */
export function getISTEndOfDay(date: string | Date): Date {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  return new Date(dateStr + 'T23:59:59.999+05:30');
}

/**
 * Get today's date in IST (YYYY-MM-DD format)
 */
export function getTodayIST(): string {
  const now = getCurrentIST();
  return now.toISOString().split('T')[0];
}

/**
 * Parse date string as IST
 */
export function parseISTDate(dateString: string): Date {
  // If no timezone info, assume IST
  if (!dateString.includes('T') && !dateString.includes('+') && !dateString.includes('Z')) {
    return new Date(dateString + 'T00:00:00+05:30');
  }
  return new Date(dateString);
}

/**
 * Convert any date to IST timezone string
 */
export function toISTString(date: Date): string {
  const istDate = utcToIST(date);
  return istDate.toISOString().replace('Z', '+05:30');
}
