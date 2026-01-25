const fs = require('fs');
const path = require('path');

// Read the timeline-data.ts file
const filePath = path.join(__dirname, 'timeline-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the events array content
const eventsMatch = content.match(/export const timelineEvents: TimelineEvent\[\] = \[([\s\S]*?)\n\]/);
if (!eventsMatch) {
  console.error('Could not find timelineEvents array');
  process.exit(1);
}

const eventsString = '[' + eventsMatch[1] + '\n]';

// Parse the events (using eval in a safe context since it's our own data)
const timelineEvents = eval(eventsString);

// Sort by year (convert to number for proper sorting)
timelineEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));

// Rebuild the file content
const beforeEvents = content.substring(0, content.indexOf('export const timelineEvents'));
const afterEvents = content.substring(content.indexOf(']', content.indexOf('export const timelineEvents')) + 1);

// Convert events back to string format
const eventsCode = `export const timelineEvents: TimelineEvent[] = ${JSON.stringify(timelineEvents, null, 2).replace(/"([^"]+)":/g, '$1:')}\n`;

const newContent = beforeEvents + eventsCode + afterEvents;

// Write back
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Timeline events sorted successfully!');
console.log(`Total events: ${timelineEvents.length}`);
console.log(`Year range: ${timelineEvents[0].year} - ${timelineEvents[timelineEvents.length - 1].year}`);
