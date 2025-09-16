// IST Timezone utility functions for backend
// IST is UTC+5:30

const IST_OFFSET_HOURS = 5.5;
const IST_OFFSET_MS = IST_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Get current date and time in IST
 */
function getCurrentIST() {
  const now = new Date();
  return new Date(now.getTime() + IST_OFFSET_MS);
}

/**
 * Convert UTC date to IST
 */
function utcToIST(utcDate) {
  return new Date(utcDate.getTime() + IST_OFFSET_MS);
}

/**
 * Convert IST date to UTC
 */
function istToUTC(istDate) {
  return new Date(istDate.getTime() - IST_OFFSET_MS);
}

/**
 * Get start of day in IST (00:00:00)
 */
function getISTStartOfDay(dateString) {
  return new Date(dateString + 'T00:00:00+05:30');
}

/**
 * Get end of day in IST (23:59:59.999)
 */
function getISTEndOfDay(dateString) {
  return new Date(dateString + 'T23:59:59.999+05:30');
}

/**
 * Get today's date in IST (YYYY-MM-DD format)
 */
function getTodayIST() {
  const now = getCurrentIST();
  return now.toISOString().split('T')[0];
}

/**
 * Convert IST date range to UTC for database queries
 */
function getISTDateRangeUTC(dateString) {
  const istStart = getISTStartOfDay(dateString);
  const istEnd = getISTEndOfDay(dateString);
  
  return {
    utcStart: istToUTC(istStart),
    utcEnd: istToUTC(istEnd),
    istStart,
    istEnd
  };
}

/**
 * Format date in IST timezone
 */
function formatDateIST(date) {
  const istDate = utcToIST(date);
  return istDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format time in IST timezone
 */
function formatTimeIST(date) {
  const istDate = utcToIST(date);
  return istDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

module.exports = {
  IST_OFFSET_HOURS,
  IST_OFFSET_MS,
  getCurrentIST,
  utcToIST,
  istToUTC,
  getISTStartOfDay,
  getISTEndOfDay,
  getTodayIST,
  getISTDateRangeUTC,
  formatDateIST,
  formatTimeIST
};
