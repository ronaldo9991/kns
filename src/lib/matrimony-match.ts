// Pure, dependency-free matrimony compatibility scoring.
// Safe to import on both client and server (no DB / AI imports here).

// Rasi compatibility matrix (traditional Tamil astrology).
const RASI_COMPAT: Record<string, string[]> = {
  Mesham: ["Simmam", "Dhanusu", "Mithunam", "Thulam"],
  Rishabam: ["Kanni", "Magaram", "Kadagam", "Viruchigam"],
  Mithunam: ["Thulam", "Kumbam", "Mesham", "Simmam"],
  Kadagam: ["Viruchigam", "Meenam", "Rishabam", "Kanni"],
  Simmam: ["Mesham", "Dhanusu", "Mithunam", "Thulam"],
  Kanni: ["Rishabam", "Magaram", "Kadagam", "Viruchigam"],
  Thulam: ["Mithunam", "Kumbam", "Mesham", "Simmam"],
  Viruchigam: ["Kadagam", "Meenam", "Rishabam", "Kanni"],
  Dhanusu: ["Mesham", "Simmam", "Thulam", "Kumbam"],
  Magaram: ["Rishabam", "Kanni", "Viruchigam", "Meenam"],
  Kumbam: ["Mithunam", "Thulam", "Dhanusu", "Mesham"],
  Meenam: ["Kadagam", "Viruchigam", "Magaram", "Rishabam"],
};

export type MatchInput = {
  rasi?: string | null;
  religion?: string | null;
  age: number;
  gender: string;
};

export function computeCompatibility(a: MatchInput, b: MatchInput): number {
  let score = 0;
  // Religion: 30 pts
  if (a.religion && b.religion && a.religion === b.religion) score += 30;
  // Rasi: 20 pts
  if (a.rasi && b.rasi) {
    if (RASI_COMPAT[a.rasi]?.includes(b.rasi)) score += 20;
    else if (a.rasi === b.rasi) score += 10;
  }
  // Age: 20 pts — traditional preference: groom 0–6 yrs older than bride
  const malAge = a.gender === "Male" ? a.age : b.age;
  const femAge = a.gender === "Female" ? a.age : b.age;
  const ageDiff = malAge - femAge;
  if (ageDiff >= 0 && ageDiff <= 6) score += 20;
  else if (ageDiff >= -2 && ageDiff < 0) score += 12;
  else if (Math.abs(ageDiff) <= 10) score += 5;
  // Base compatibility: 30 pts
  score += 30;
  return Math.min(100, score);
}
