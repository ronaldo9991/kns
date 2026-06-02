import { describe, test, expect } from "bun:test";
import { dict } from "../src/lib/i18n";

type DeepKeys = (obj: unknown, prefix?: string) => string[];
const deepKeys: DeepKeys = (obj, prefix = "") => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => deepKeys(v, prefix ? `${prefix}.${k}` : k));
};

describe("i18n completeness", () => {
  const enKeys = deepKeys(dict.en).sort();
  const taKeys = deepKeys(dict.ta).sort();

  test("Tamil dict has the same number of leaf keys as English", () => {
    expect(taKeys.length).toBe(enKeys.length);
  });

  test("every English key exists in Tamil", () => {
    const taSet = new Set(taKeys);
    const missing = enKeys.filter((k) => !taSet.has(k));
    expect(missing).toEqual([]);
  });

  test("every Tamil key exists in English (no extra keys)", () => {
    const enSet = new Set(enKeys);
    const extra = taKeys.filter((k) => !enSet.has(k));
    expect(extra).toEqual([]);
  });

  test("no Tamil value is an empty string", () => {
    const emptyKeys = taKeys.filter((k) => {
      const parts = k.split(".");
      let v: any = dict.ta;
      for (const p of parts) v = v?.[p];
      return typeof v === "string" && v.trim() === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  test("no Tamil value equals its English counterpart (proving translation exists)", () => {
    const untranslated: string[] = [];
    for (const k of enKeys) {
      const parts = k.split(".");
      let en: any = dict.en;
      let ta: any = dict.ta;
      for (const p of parts) { en = en?.[p]; ta = ta?.[p]; }
      // Skip keys where English and Tamil are legitimately the same
      // (numbers, proper nouns that don't change: "1952", "42 / 1952", email, phone)
      if (typeof en === "string" && typeof ta === "string" && en === ta) {
        const exemptions = ["1952", "42 / 1952", "office@kovainadarsangam.org", "0422-2491297 · 0422-2491298", "349, Dr. Radhakrishna Road", "Mon–Sat", "English"];
        if (!exemptions.some((e) => en.includes(e))) {
          untranslated.push(k);
        }
      }
    }
    expect(untranslated).toEqual([]);
  });
});

describe("nav keys", () => {
  test("all nav items translated", () => {
    const navKeys = ["home", "matrimony", "members", "events", "scholarships", "about", "admin"] as const;
    for (const key of navKeys) {
      expect(dict.ta.nav[key]).toBeTruthy();
      expect(dict.ta.nav[key]).not.toBe(dict.en.nav[key]);
    }
  });
});

describe("scholarship steps", () => {
  test("both languages have 4 steps", () => {
    expect(dict.en.scholarships.steps.length).toBe(4);
    expect(dict.ta.scholarships.steps.length).toBe(4);
  });

  test("Tamil steps differ from English steps", () => {
    dict.en.scholarships.steps.forEach((step, i) => {
      expect(dict.ta.scholarships.steps[i]).not.toBe(step);
    });
  });
});

describe("home service cards", () => {
  test("both languages have 6 service cards", () => {
    expect(dict.en.home.serviceCards.length).toBe(6);
    expect(dict.ta.home.serviceCards.length).toBe(6);
  });

  test("Tamil service titles differ from English", () => {
    dict.en.home.serviceCards.forEach((card, i) => {
      expect(dict.ta.home.serviceCards[i].title).not.toBe(card.title);
    });
  });
});
