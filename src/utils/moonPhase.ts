// Mondphasen-Berechnungswerkzeug
export interface MoonPhase {
  name: string;
  nameZh: string;
  nameDe: string; // German name
  illumination: number; // 0-1, Beleuchtung
  phase: number; // 0-1, Mondphasen-Zyklusposition
  description: string;
  descriptionDe: string; // German description
  emoji: string;
}

export function calculateMoonPhase(date: Date = new Date(), timezone: string = 'Europe/Berlin'): MoonPhase {
  // Bekannter Neumond: 6. Januar 2000, 18:14 UTC
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  const lunarCycle = 29.5305882; // Mondzyklusdauer in Tagen

  // Berechnung der Tagesdifferenz
  const timeDiff = date.getTime() - knownNewMoon.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  // Berechnung der aktuellen Mondphasenposition (0-1)
  const phase = (daysDiff % lunarCycle) / lunarCycle;
  
  // Berechnung der Beleuchtung (basierend auf Mondphasenzyklus)
  const illumination = phase <= 0.5 
    ? phase * 2 
    : 2 - (phase * 2);

  // Bestimmung der Mondphasennamen
  let name: string;
  let nameZh: string;
  let nameDe: string;
  let emoji: string;
  let description: string;
  let descriptionDe: string;

  if (phase < 0.035 || phase > 0.965) {
    name = "New Moon";
    nameZh = "新月";
    nameDe = "Neumond";
    emoji = "🌑";
    description = "月球完全位于地球与太阳之间，几乎不可见";
    descriptionDe = "Der Mond befindet sich vollständig zwischen Erde und Sonne und ist kaum sichtbar";
  } else if (phase < 0.215) {
    name = "Waxing Crescent";
    nameZh = "娥眉月";
    nameDe = "Zunehmende Sichel";
    emoji = "🌒";
    description = "月亮右侧开始显现，逐渐变亮";
    descriptionDe = "Die rechte Seite des Mondes wird sichtbar und wird heller";
  } else if (phase < 0.285) {
    name = "First Quarter";
    nameZh = "上弦月";
    nameDe = "Erstes Viertel";
    emoji = "🌓";
    description = "月亮右半部分被照亮";
    descriptionDe = "Die rechte Hälfte des Mondes ist beleuchtet";
  } else if (phase < 0.465) {
    name = "Waxing Gibbous";
    nameZh = "盈凸月";
    nameDe = "Zunehmender Mond";
    emoji = "🌔";
    description = "月亮超过一半被照亮，继续增大";
    descriptionDe = "Mehr als die Hälfte des Mondes ist beleuchtet und wächst weiter";
  } else if (phase < 0.535) {
    name = "Full Moon";
    nameZh = "满月";
    nameDe = "Vollmond";
    emoji = "🌕";
    description = "月球完全被阳光照亮，呈现完整圆形";
    descriptionDe = "Der Mond ist vollständig vom Sonnenlicht beleuchtet und erscheint als vollständiger Kreis";
  } else if (phase < 0.715) {
    name = "Waning Gibbous";
    nameZh = "亏凸月";
    nameDe = "Abnehmender Mond";
    emoji = "🌖";
    description = "月亮开始减小，但仍超过一半被照亮";
    descriptionDe = "Der Mond beginnt zu schrumpfen, ist aber noch mehr als zur Hälfte beleuchtet";
  } else if (phase < 0.785) {
    name = "Last Quarter";
    nameZh = "下弦月";
    nameDe = "Letztes Viertel";
    emoji = "🌗";
    description = "月亮左半部分被照亮";
    descriptionDe = "Die linke Hälfte des Mondes ist beleuchtet";
  } else {
    name = "Waning Crescent";
    nameZh = "残月";
    nameDe = "Abnehmende Sichel";
    emoji = "🌘";
    description = "月亮左侧显现，逐渐变暗直至新月";
    descriptionDe = "Die linke Seite des Mondes ist sichtbar und wird dunkler bis zum Neumond";
  }

  return {
    name,
    nameZh,
    nameDe,
    illumination: Math.max(0, Math.min(1, illumination)),
    phase,
    description,
    descriptionDe,
    emoji
  };
}

export function getNextMoonPhases(startDate: Date = new Date(), count: number = 4, timezone: string = 'Europe/Berlin'): Array<{date: Date, phase: MoonPhase}> {
  const phases = [];
  const lunarCycle = 29.5305882;
  
  for (let i = 0; i < count; i++) {
    const futureDate = new Date(startDate.getTime() + (i * lunarCycle * 24 * 60 * 60 * 1000));
    phases.push({
      date: futureDate,
      phase: calculateMoonPhase(futureDate, timezone)
    });
  }
  
  return phases;
}