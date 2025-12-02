export const parseNaturalLanguage = (text, baseDate = new Date()) => {
  let title = text;
  let targetDate = new Date(baseDate);
  let startTime = "23:59"; // CHANGED: Default to End of Day
  let priority = "normal"; // Default priority
  let duration = "60";

  // Helper to clean string (case insensitive removal)
  const removeText = (str, key) => str.replace(new RegExp(`\\b${key}\\b`, 'gi'), '');

  // 1. PRIORITY DETECTION
  const lower = title.toLowerCase();
  
  if (lower.includes('high priority') || lower.includes('urgent') || lower.includes('important')) {
    priority = 'high';
    // Clean specific phrases
    title = title.replace(/high priority|urgent|important/gi, ''); 
  } else if (lower.includes('low priority')) {
    priority = 'low';
    title = title.replace(/low priority/gi, '');
  }

  // 2. DATE DETECTION (Relative keywords)
  if (lower.includes('tomorrow')) {
    targetDate.setDate(targetDate.getDate() + 1);
    title = removeText(title, 'tomorrow');
  } else if (lower.includes('today')) {
    // Date is already 'today' by default, just remove the word
    title = removeText(title, 'today');
  }

  // 3. TIME DETECTION
  // Regex for "at 5", "at 5pm", "at 5:30", "at 5.30 p.m."
  const timeRegex = /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i;
  const match = title.match(timeRegex);

  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2] || "00";
    // Normalize 'p.m.' -> 'pm'
    const rawPeriod = match[3] ? match[3].toLowerCase().replace(/\./g, '') : null;

    //  SMART HOUR LOGIC 
    if (rawPeriod) {
        // Explicit AM/PM provided
        if (rawPeriod === 'pm' && hours < 12) hours += 12;
        if (rawPeriod === 'am' && hours === 12) hours = 0;
    } else {
        // No AM/PM provided - Use Smart Rules
        // Rule: 12 to 8 -> PM (e.g., "at 5" -> 17:00)
        // Rule: 9, 10, 11 -> AM (e.g., "at 10" -> 10:00)
        if (hours === 12 || (hours >= 1 && hours <= 8)) {
            if (hours < 12) hours += 12; // Convert 1-8 to 13-20. 12 stays 12 (noon).
        }
        // 9, 10, 11 remain as AM (default)
    }

    startTime = `${hours.toString().padStart(2, '0')}:${minutes}`;

    // Remove the ENTIRE time string (e.g., "at 5 p.m.") from title
    title = title.replace(match[0], '');
  }

  // 4. FINAL CLEANUP
  // Remove extra spaces left by removals (e.g. "Physics Test   ")
  title = title.replace(/\s+/g, ' ').trim();

  return {
    title: title || "New Task",
    date: targetDate.toISOString().split('T')[0],
    startTime,
    priority, // Return the detected priority
    duration,
    location: '',
    repeat: 'none',
    reminder: 'none',
    notes: 'Created via Quick Add'
  };
};