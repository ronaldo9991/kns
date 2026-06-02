import { describe, test, expect } from "bun:test";
import { computeCompatibility } from "../src/lib/matrimony-match";

describe("computeCompatibility", () => {
  test("base score is always 30 (minimum)", () => {
    const a = { age: 30, gender: "Male" };
    const b = { age: 28, gender: "Female" };
    const score = computeCompatibility(a, b);
    expect(score).toBeGreaterThanOrEqual(30);
  });

  test("same religion adds 30 points", () => {
    const noReligion = computeCompatibility({ age: 30, gender: "Male" }, { age: 27, gender: "Female" });
    const sameReligion = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu" },
      { age: 27, gender: "Female", religion: "Hindu" }
    );
    expect(sameReligion - noReligion).toBe(30);
  });

  test("different religions add 0 points", () => {
    const noReligion = computeCompatibility({ age: 30, gender: "Male" }, { age: 27, gender: "Female" });
    const diffReligion = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu" },
      { age: 27, gender: "Female", religion: "Christian" }
    );
    expect(diffReligion).toBe(noReligion);
  });

  test("compatible rasi adds 20 points", () => {
    // Mesham is compatible with Simmam per RASI_COMPAT
    const noRasi = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu" },
      { age: 27, gender: "Female", religion: "Hindu" }
    );
    const compatRasi = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu", rasi: "Mesham" },
      { age: 27, gender: "Female", religion: "Hindu", rasi: "Simmam" }
    );
    expect(compatRasi - noRasi).toBe(20);
  });

  test("same rasi adds 10 points", () => {
    const noRasi = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu" },
      { age: 27, gender: "Female", religion: "Hindu" }
    );
    const sameRasi = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu", rasi: "Kanni" },
      { age: 27, gender: "Female", religion: "Hindu", rasi: "Kanni" }
    );
    expect(sameRasi - noRasi).toBe(10);
  });

  test("ideal age difference (groom 0-6 yrs older) adds 20 points", () => {
    const noAge = computeCompatibility(
      { age: 50, gender: "Male", religion: "Hindu" },
      { age: 20, gender: "Female", religion: "Hindu" }
    );
    const idealAge = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu" },
      { age: 27, gender: "Female", religion: "Hindu" }
    );
    expect(idealAge - noAge).toBe(20);
  });

  test("slight reverse age (bride 1-2 yrs older) adds 12 points", () => {
    const base = computeCompatibility({ age: 40, gender: "Male" }, { age: 20, gender: "Female" });
    const slightReverse = computeCompatibility(
      { age: 28, gender: "Male" },
      { age: 29, gender: "Female" } // bride 1 yr older = diff is -1
    );
    expect(slightReverse - base).toBe(12);
  });

  test("large age gap adds minimal points", () => {
    const score = computeCompatibility(
      { age: 50, gender: "Male" },
      { age: 20, gender: "Female" }
    );
    // diff = 30 > 10, so only base 30 pts
    expect(score).toBe(30);
  });

  test("never exceeds 100", () => {
    const score = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu", rasi: "Mesham" },
      { age: 27, gender: "Female", religion: "Hindu", rasi: "Simmam" }
    );
    expect(score).toBeLessThanOrEqual(100);
  });

  test("perfect score: same religion + compat rasi + ideal age = 100", () => {
    // 30 (religion) + 20 (compat rasi) + 20 (ideal age) + 30 (base) = 100
    const score = computeCompatibility(
      { age: 30, gender: "Male", religion: "Hindu", rasi: "Mesham" },
      { age: 27, gender: "Female", religion: "Hindu", rasi: "Simmam" }
    );
    expect(score).toBe(100);
  });

  test("symmetric: both orderings of a/b give the same score", () => {
    const a = { age: 30, gender: "Male", religion: "Hindu", rasi: "Mesham" };
    const b = { age: 27, gender: "Female", religion: "Hindu", rasi: "Simmam" };
    expect(computeCompatibility(a, b)).toBe(computeCompatibility(b, a));
  });

  test("missing rasi fields do not crash", () => {
    expect(() => computeCompatibility(
      { age: 28, gender: "Male" },
      { age: 25, gender: "Female" }
    )).not.toThrow();
  });

  test("null rasi treated as missing", () => {
    const withNull = computeCompatibility(
      { age: 28, gender: "Male", rasi: null },
      { age: 25, gender: "Female", rasi: null }
    );
    const withUndefined = computeCompatibility(
      { age: 28, gender: "Male" },
      { age: 25, gender: "Female" }
    );
    expect(withNull).toBe(withUndefined);
  });

  test("all rasi pairs in the compat matrix are recognized", () => {
    const RASI_COMPAT: Record<string, string[]> = {
      Mesham: ["Simmam", "Dhanusu", "Mithunam", "Thulam"],
      Rishabam: ["Kanni", "Magaram", "Kadagam", "Viruchigam"],
    };
    for (const [a, list] of Object.entries(RASI_COMPAT)) {
      for (const b of list) {
        const score = computeCompatibility(
          { age: 30, gender: "Male", rasi: a },
          { age: 27, gender: "Female", rasi: b }
        );
        expect(score).toBeGreaterThanOrEqual(50); // base 30 + rasi 20
      }
    }
  });
});
