/**
 * NSPIRE unit sampling — a port of the app's src/services/unitSamplingService.ts.
 *
 * Kept identical to the app on purpose: the same property has to produce the
 * same sample whichever one an inspector opens, or two people inspect two
 * different sets of units and neither report matches the other.
 *
 * Note for anyone comparing with the server: inspire-backend's
 * utils/nspireSampling.js carries a different table (it inspects every unit up
 * to 25, where this one is already down to 15) and shuffles with mulberry32
 * rather than the LCG below, so POST /inspections/sample-units does not agree
 * with this. The app's table is the one taken as correct; the server's is a
 * known discrepancy, not something this file should quietly work around.
 */

export interface UnitSample {
  totalUnits: number;
  unitsToInspect: number;
  selectedUnits: string[];
}

/** [minUnits, maxUnits, scoringFactor] — how many units an inspection covers. */
const NSPIRE_SAMPLING_RANGES: [number, number, number][] = [
  [1, 1, 1],
  [2, 2, 1],
  [3, 3, 2],
  [4, 4, 3],
  [5, 5, 4],
  [6, 6, 5],
  [7, 7, 6],
  [8, 8, 7],
  [9, 9, 8],
  [10, 10, 9],
  [11, 12, 9],
  [13, 14, 10],
  [15, 16, 11],
  [17, 18, 12],
  [19, 21, 13],
  [22, 24, 14],
  [25, 27, 15],
  [28, 30, 16],
  [31, 35, 17],
  [36, 39, 18],
  [40, 45, 19],
  [46, 51, 20],
  [52, 59, 21],
  [60, 67, 22],
  [68, 78, 23],
  [79, 92, 24],
  [93, 110, 25],
  [111, 120, 26],
  [121, 166, 27],
  [167, 214, 28],
  [215, 295, 29],
  [296, 455, 30],
  [456, 920, 31],
  [921, Infinity, 32],
];

function getScoringFactor(totalUnits: number): number {
  if (totalUnits < 1) {
    throw new Error('Total units must be at least 1');
  }

  for (const [min, max, factor] of NSPIRE_SAMPLING_RANGES) {
    if (totalUnits >= min && totalUnits <= max) {
      return factor;
    }
  }

  // Unreachable: the last range runs to Infinity.
  return 32;
}

/**
 * The same property always yields the same units. The property id is hashed
 * into a seed, so the choice survives a reload and two inspectors opening the
 * same property are sent to the same doors.
 */
function generateDeterministicSample(
  totalUnits: number,
  unitsToInspect: number,
  propertyId: string
): string[] {
  let hash = 0;
  for (let i = 0; i < propertyId.length; i++) {
    const char = propertyId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // keep it a 32-bit integer
  }

  const seed = Math.abs(hash);

  const allUnits = Array.from({ length: totalUnits }, (_, i) =>
    `Unit ${(i + 1).toString().padStart(3, '0')}`
  );

  if (unitsToInspect >= totalUnits) {
    return allUnits;
  }

  const shuffled = [...allUnits];
  let currentSeed = seed;

  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = currentSeed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, unitsToInspect);
}

export function getUnitsToInspect(totalUnits: number): number {
  if (totalUnits < 1) {
    throw new Error(`Property must have at least 1 unit. Property has ${totalUnits} units.`);
  }

  return getScoringFactor(totalUnits);
}

export function generateRandomUnitSample(totalUnits: number, propertyId: string): UnitSample {
  if (totalUnits < 1) {
    throw new Error(`Property must have at least 1 unit. This property has ${totalUnits} units.`);
  }

  if (!propertyId || propertyId.trim() === '') {
    throw new Error('Property ID is required for consistent unit sampling.');
  }

  const unitsToInspect = getUnitsToInspect(totalUnits);
  const selectedUnits = generateDeterministicSample(totalUnits, unitsToInspect, propertyId);

  return { totalUnits, unitsToInspect, selectedUnits };
}

export function isRandomSelectionAvailable(totalUnits: number): boolean {
  return totalUnits >= 1;
}

export function getSamplingExplanation(totalUnits: number): string {
  if (!isRandomSelectionAvailable(totalUnits)) {
    return 'Random unit selection requires at least 1 unit.';
  }

  const unitsToInspect = getUnitsToInspect(totalUnits);
  return `NSPIRE requires ${unitsToInspect} of ${totalUnits} units to be inspected. The same units are chosen every time for this property.`;
}
