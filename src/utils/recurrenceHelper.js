export const shouldShowEvent = (event, targetDateStr) => {
  // Standardize to Midnight Local Time to avoid timezone overlaps
  const start = new Date(event.date + 'T00:00:00'); 
  const target = new Date(targetDateStr + 'T00:00:00');
  
  if (target < start) return false;

  if (!event.repeat || event.repeat === 'none') {
    return event.date === targetDateStr;
  }

  if (event.repeat === 'daily') return true;
  if (event.repeat === 'weekly') return start.getDay() === target.getDay();
  if (event.repeat === 'monthly') return start.getDate() === target.getDate();
  if (event.repeat === 'yearly') {
    return start.getMonth() === target.getMonth() && start.getDate() === target.getDate();
  }

  // Custom Recurrence
  if (event.repeat.startsWith('Every')) {
    return checkCustomRecurrence(event.repeat, start, target);
  }

  return false;
};

const checkCustomRecurrence = (rule, start, target) => {
  // Rule Example: "Every 1 week on Sun, Sat"
  const lowerRule = rule.toLowerCase();
  const match = lowerRule.match(/every\s+(\d+)\s+(day|week|month|year)/);
  if (!match) return false;

  const freq = parseInt(match[1]);
  const unit = match[2];

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = target - start;
  const diffDays = Math.floor(diffTime / msPerDay);

  // 1. Check Basic Cycle (Is it the right week/month?)
  if (unit === 'week') {
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks % freq !== 0) return false;
    
    // 2. Check Specific Days (The missing logic!)
    if (lowerRule.includes(' on ')) {
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const targetDayName = dayNames[target.getDay()]; // e.g. 'sat'
      
      // Check if 'sat' exists in the rule string "on sun, sat"
      // We look for the day name inside the part AFTER " on "
      const daysPart = lowerRule.split(' on ')[1];
      if (!daysPart.includes(targetDayName)) {
        return false;
      }
    } else {
      // If no days specified, default to start date's day
      if (start.getDay() !== target.getDay()) return false;
    }
    return true;
  }

  if (unit === 'day') return diffDays % freq === 0;

  if (unit === 'month') {
    const diffMonths = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
    return diffMonths % freq === 0 && target.getDate() === start.getDate();
  }
  
  if (unit === 'year') {
    const diffYears = target.getFullYear() - start.getFullYear();
    return diffYears % freq === 0 && target.getMonth() === start.getMonth() && target.getDate() === start.getDate();
  }

  return false;
};