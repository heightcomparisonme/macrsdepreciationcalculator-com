import jsPDF from 'jspdf';

interface MoonPhaseData {
  date: string;
  phase: string;
  illumination: number;
  isWaxing: boolean;
  moonLongitude: number;
}

interface CalendarConfig {
  region: 'germany' | 'switzerland' | 'austria' | 'other';
  template: 'minimal' | 'hair' | 'garden';
  activities: string[];
  background: 'dark' | 'kraft' | 'traditional' | 'modern';
}

interface ActivityRule {
  phase: string[];
  zodiac?: string[];
  description: string;
}

// Activity rules for highlighting dates
const ACTIVITY_RULES: Record<string, ActivityRule> = {
  haircut: {
    phase: ['Zunehmender Mond', 'Vollmond'],
    zodiac: ['Löwe', 'Jungfrau', 'Widder'],
    description: 'Optimal für Haarschnitt - fördert Wachstum'
  },
  haircolor: {
    phase: ['Abnehmender Mond'],
    zodiac: ['Stier', 'Waage'],
    description: 'Optimal für Färben - Farbe hält länger'
  },
  planting: {
    phase: ['Zunehmender Mond'],
    zodiac: ['Stier', 'Krebs', 'Jungfrau', 'Skorpion', 'Steinbock', 'Fische'],
    description: 'Optimal für Aussaat - beste Keimung'
  },
  weeding: {
    phase: ['Abnehmender Mond'],
    zodiac: ['Zwillinge', 'Löwe', 'Wassermann'],
    description: 'Optimal für Unkraut jäten'
  },
  cleaning: {
    phase: ['Abnehmender Mond', 'Neumond'],
    zodiac: [],
    description: 'Optimal für Reinigung'
  }
};

// Convert English phase name to German
function translatePhaseToGerman(englishPhase: string): string {
  const phaseMap: Record<string, string> = {
    'new_moon': 'Neumond',
    'waxing_crescent': 'Zunehmende Sichel',
    'first_quarter': 'Zunehmender Mond',
    'waxing_gibbous': 'Zunehmender Dreiviertelmond',
    'full_moon': 'Vollmond',
    'waning_gibbous': 'Abnehmender Dreiviertelmond',
    'last_quarter': 'Abnehmender Mond',
    'waning_crescent': 'Abnehmende Sichel'
  };
  return phaseMap[englishPhase] || englishPhase;
}

// Get generalized phase name for activity matching
function getGeneralizedPhase(germanPhase: string, isWaxing: boolean): string {
  if (germanPhase === 'Neumond') return 'Neumond';
  if (germanPhase === 'Vollmond') return 'Vollmond';
  return isWaxing ? 'Zunehmender Mond' : 'Abnehmender Mond';
}

// Zodiac sign calculation from moon longitude
function getZodiacSign(moonLongitude: number): string {
  const signs = [
    'Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
    'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'
  ];
  const index = Math.floor(moonLongitude / 30);
  return signs[index] || 'Widder';
}

// Check if a date should be highlighted based on activities
function shouldHighlight(data: MoonPhaseData, activities: string[]): { highlight: boolean; activity: string | null } {
  const zodiac = getZodiacSign(data.moonLongitude);

  // Translate English phase to German
  const germanPhase = translatePhaseToGerman(data.phase);

  // Get generalized phase for matching (e.g., all waxing phases → "Zunehmender Mond")
  const generalizedPhase = getGeneralizedPhase(germanPhase, data.isWaxing);

  for (const activity of activities) {
    const rule = ACTIVITY_RULES[activity];
    if (!rule) continue;

    // Check if exact phase or generalized phase matches
    const phaseMatch = rule.phase.includes(germanPhase) || rule.phase.includes(generalizedPhase);
    const zodiacMatch = !rule.zodiac || rule.zodiac.length === 0 || rule.zodiac.includes(zodiac);

    if (phaseMatch && zodiacMatch) {
      return { highlight: true, activity };
    }
  }

  return { highlight: false, activity: null };
}

// Background colors based on theme
function getBackgroundColors(background: string): { page: string; cell: string; header: string; text: string; accent: string } {
  switch (background) {
    case 'dark':
      return {
        page: '#1a1a1a',
        cell: '#2a2a2a',
        header: '#3a3a3a',
        text: '#e0e0e0',
        accent: '#fbbf24'
      };
    case 'kraft':
      return {
        page: '#d4a574',
        cell: '#e8c9a1',
        header: '#b88a5a',
        text: '#3a2f26',
        accent: '#8b4513'
      };
    case 'modern':
      return {
        page: '#f3f4f6',
        cell: '#ffffff',
        header: '#6366f1',
        text: '#111827',
        accent: '#4f46e5'
      };
    case 'traditional':
    default:
      return {
        page: '#ffffff',
        cell: '#f9fafb',
        header: '#374151',
        text: '#111827',
        accent: '#059669'
      };
  }
}

// Moon phase emoji (accepts both English and German phase names)
function getMoonEmoji(phase: string): string {
  // Translate to German if English
  const germanPhase = translatePhaseToGerman(phase);

  const emojiMap: Record<string, string> = {
    'Neumond': '🌑',
    'Zunehmende Sichel': '🌒',
    'Zunehmender Mond': '🌓',
    'Zunehmender Dreiviertelmond': '🌔',
    'Vollmond': '🌕',
    'Abnehmender Dreiviertelmond': '🌖',
    'Abnehmender Mond': '🌗',
    'Abnehmende Sichel': '🌘'
  };
  return emojiMap[germanPhase] || '🌑';
}

export async function generateCalendarPDF(
  year: number,
  monthsData: MoonPhaseData[][],
  config: CalendarConfig
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const colors = getBackgroundColors(config.background);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Add title page
  doc.setFillColor(colors.page);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFontSize(28);
  doc.setTextColor(colors.text);
  doc.text(`Mondkalender ${year}`, pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(14);
  const templateNames: Record<string, string> = {
    minimal: 'Minimalistisch',
    hair: 'Haarpflege-Fokus',
    garden: 'Garten-Fokus'
  };
  doc.text(templateNames[config.template] || 'Minimalistisch', pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(colors.accent);
  doc.text('Erstellt mit LunaCalendar.de', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Generate months (2 months per page)
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    if (monthIndex % 2 === 0) {
      doc.addPage();
      doc.setFillColor(colors.page);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    const yOffset = monthIndex % 2 === 0 ? margin : pageHeight / 2 + 5;
    const monthData = monthsData[monthIndex] || [];
    const monthName = monthNames[monthIndex];

    // Month header
    doc.setFillColor(colors.header);
    doc.rect(margin, yOffset, contentWidth, 12, 'F');
    doc.setFontSize(14);
    doc.setTextColor(colors.page === '#1a1a1a' || colors.page === '#d4a574' ? '#ffffff' : colors.text);
    doc.text(monthName, pageWidth / 2, yOffset + 8, { align: 'center' });

    // Weekday headers
    const cellWidth = contentWidth / 7;
    const cellHeight = 8;
    let currentY = yOffset + 14;

    doc.setFontSize(8);
    doc.setTextColor(colors.text);
    weekDays.forEach((day, index) => {
      doc.text(day, margin + index * cellWidth + cellWidth / 2, currentY + 5, { align: 'center' });
    });

    currentY += cellHeight;

    // Calculate first day of month and total days
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const startCol = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    let currentDay = 1;
    let rowCount = 0;

    while (currentDay <= daysInMonth) {
      const maxRows = monthIndex % 2 === 0 ? 5 : 4; // Limit rows per half-page
      if (rowCount >= maxRows) break;

      for (let col = 0; col < 7; col++) {
        if (rowCount === 0 && col < startCol) continue;
        if (currentDay > daysInMonth) break;

        const x = margin + col * cellWidth;
        const y = currentY + rowCount * cellHeight;

        const dayData = monthData.find(d => new Date(d.date).getDate() === currentDay);
        const { highlight, activity } = dayData ? shouldHighlight(dayData, config.activities) : { highlight: false, activity: null };

        // Draw cell background
        if (highlight) {
          doc.setFillColor(colors.accent);
          doc.rect(x, y, cellWidth, cellHeight, 'F');
        } else {
          doc.setFillColor(colors.cell);
          doc.rect(x, y, cellWidth, cellHeight, 'F');
        }

        // Draw border
        doc.setDrawColor(colors.text);
        doc.setLineWidth(0.1);
        doc.rect(x, y, cellWidth, cellHeight);

        // Draw day number
        doc.setFontSize(7);
        doc.setTextColor(highlight ? (colors.page === '#ffffff' ? '#000000' : '#ffffff') : colors.text);
        doc.text(currentDay.toString(), x + 2, y + 4);

        // Draw moon phase emoji if available
        if (dayData) {
          const moonEmoji = getMoonEmoji(dayData.phase);
          doc.setFontSize(6);
          doc.text(moonEmoji, x + cellWidth - 3, y + 4, { align: 'right' });

          // Draw illumination percentage
          doc.setFontSize(5);
          doc.text(`${Math.round(dayData.illumination)}%`, x + cellWidth / 2, y + cellHeight - 1, { align: 'center' });
        }

        currentDay++;
      }

      rowCount++;
    }
  }

  // Add legend page
  if (config.activities.length > 0) {
    doc.addPage();
    doc.setFillColor(colors.page);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFontSize(16);
    doc.setTextColor(colors.text);
    doc.text('Legende: Ihre ausgewählten Aktivitäten', pageWidth / 2, 30, { align: 'center' });

    let legendY = 50;
    config.activities.forEach(activity => {
      const rule = ACTIVITY_RULES[activity];
      if (rule) {
        doc.setFillColor(colors.accent);
        doc.rect(margin, legendY, 8, 8, 'F');

        doc.setFontSize(12);
        doc.setTextColor(colors.text);
        const activityNames: Record<string, string> = {
          haircut: 'Haarschnitt',
          haircolor: 'Haarfarbe',
          planting: 'Aussaat',
          weeding: 'Unkraut jäten',
          cleaning: 'Reinigung'
        };
        doc.text(activityNames[activity] || activity, margin + 12, legendY + 6);

        doc.setFontSize(9);
        doc.setTextColor(colors.text);
        doc.text(rule.description, margin + 12, legendY + 12);

        legendY += 20;
      }
    });
  }

  return doc.output('blob');
}
