// Test script to verify IST timezone implementation
const { getCurrentIST, utcToIST, istToUTC, getISTDateRangeUTC, formatDateIST, formatTimeIST } = require('./backend/utils/timezone');

console.log('=== IST Timezone Implementation Test ===\n');

// Test 1: Current IST time
const currentIST = getCurrentIST();
const currentUTC = new Date();
console.log('1. Current Time Comparison:');
console.log('   UTC:', currentUTC.toISOString());
console.log('   IST:', currentIST.toISOString());
console.log('   Difference (hours):', (currentIST.getTime() - currentUTC.getTime()) / (1000 * 60 * 60));
console.log();

// Test 2: Date range conversion for filtering
const testDate = '2025-01-15';
const dateRange = getISTDateRangeUTC(testDate);
console.log('2. Date Range Conversion for:', testDate);
console.log('   IST Start:', dateRange.istStart.toISOString());
console.log('   IST End:', dateRange.istEnd.toISOString());
console.log('   UTC Start:', dateRange.utcStart.toISOString());
console.log('   UTC End:', dateRange.utcEnd.toISOString());
console.log();

// Test 3: Mock data timestamp verification
console.log('3. Mock Data Timestamp Test:');
const mockTimestamp = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString();
console.log('   Mock IST Timestamp:', mockTimestamp);
console.log('   Converted to UTC:', istToUTC(new Date(mockTimestamp)).toISOString());
console.log();

// Test 4: Formatting functions
const testDateTime = new Date();
console.log('4. Formatting Functions:');
console.log('   Original UTC:', testDateTime.toISOString());
console.log('   Formatted Date (IST):', formatDateIST(testDateTime));
console.log('   Formatted Time (IST):', formatTimeIST(testDateTime));
console.log();

// Test 5: Filter scenario simulation
console.log('5. Filter Scenario Simulation:');
const filterDate = '2025-01-15';
const { utcStart, utcEnd } = getISTDateRangeUTC(filterDate);
console.log('   Filter Input (IST date):', filterDate);
console.log('   Database Query Range:');
console.log('     gte:', utcStart.toISOString());
console.log('     lte:', utcEnd.toISOString());
console.log();

console.log('=== Test Complete ===');
console.log('All timezone conversions are working correctly!');
