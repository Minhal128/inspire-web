/**
 * appDeficiencyLookup.ts
 *
 * This file imports directly from the mobile app's data files (which contain
 * full multi-step `codeReference` content) and exposes a single lookup function
 * that the frontend uses to display Code of Reference information.
 *
 * Section mapping (matches inspection-category page):
 *   outside  → outsideDeficiencyMapping.ts  (26 OUTSIDE categories)
 *   inside   → unitDeficiencyMapping.ts      (35 INSIDE/common-area categories)
 *   unit     → insideDeficiencyMapping.ts    (32 UNIT categories)
 */

import {
  getOutsideDeficienciesByCategory,
  ALL_OUTSIDE_DEFICIENCIES,
} from './outsideAppData'

import {
  getInsideSubcategoryDeficiencies,
  ALL_UNIT_CATEGORIES,
} from './insideAppData'

import {

  getInsideDeficienciesForItem,
  ALL_INSIDE_CATEGORIES,
} from './unitAppData'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalise a deficiency name so fuzzy matching is more reliable */
const normalise = (str: string): string =>
  str
    .replace(/^\d+[\.\-]\s*/, '')          // strip leading "1. " or "1- "
    .toLowerCase()
    .replace(/[\u2013\u2014\u2012]/g, '-') // curly dashes → hyphen
    .replace(/[^a-z0-9\s\-]/g, ' ')        // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()

/** Return true when two deficiency names are a reasonable match */
const namesMatch = (a: string, b: string): boolean => {
  const na = normalise(a)
  const nb = normalise(b)
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true
  // word-overlap: ≥ 4 shared words
  const wa = new Set(na.split(' ').filter(w => w.length > 3))
  const wb = nb.split(' ').filter(w => w.length > 3)
  const overlap = wb.filter(w => wa.has(w)).length
  return overlap >= 4
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up the full multi-step `codeReference` text for a deficiency.
 *
 * @param section          'outside' | 'inside' | 'unit'
 * @param categoryName     The inspection item/category currently open (e.g. "1. Address and Signage")
 * @param deficiencyName   The deficiency label that the user selected
 * @returns                The full codeReference string, or undefined if not found
 */
export function lookupCodeReference(
  section: string,
  categoryName: string,
  deficiencyName: string,
): string | undefined {
  if (!deficiencyName) return undefined

  const cat = normalise(categoryName)

  // ── OUTSIDE section ─────────────────────────────────────────────────────
  if (section === 'outside') {
    // Try the direct lookup first
    const item = getOutsideDeficienciesByCategory(categoryName)
    if (item) {
      for (const d of item.deficiencies) {
        if (namesMatch(d.name, deficiencyName)) return d.codeReference
      }
    }
    // Fallback: search all outside items
    for (const key of Object.keys(ALL_OUTSIDE_DEFICIENCIES)) {
      if (cat.includes(normalise(key)) || normalise(key).includes(cat)) {
        for (const d of ALL_OUTSIDE_DEFICIENCIES[key].deficiencies) {
          if (namesMatch(d.name, deficiencyName)) return d.codeReference
        }
      }
    }
    return undefined
  }

  // ── INSIDE section (uses unitDeficiencyMapping – 35 common-area cats) ───
  if (section === 'inside') {
    // Try direct subcategory lookup
    const item = getInsideSubcategoryDeficiencies(categoryName)
    if (item) {
      for (const d of item.deficiencies) {
        if (namesMatch(d.name, deficiencyName)) return d.codeReference
      }
    }
    // Fallback: search all unit categories
    for (const category of ALL_UNIT_CATEGORIES) {
      for (const subItem of category.items) {
        if (
          cat.includes(normalise(subItem.itemName)) ||
          normalise(subItem.itemName).includes(cat)
        ) {
          for (const d of subItem.deficiencies) {
            if (namesMatch(d.name, deficiencyName)) return d.codeReference
          }
        }
      }
    }
    return undefined
  }

  // ── UNIT section (uses insideDeficiencyMapping – 32 unit cats) ──────────
  if (section === 'unit') {
    // getInsideDeficienciesForItem returns a flat InsideDeficiencyOption[]
    const deficiencies = getInsideDeficienciesForItem(categoryName)
    for (const d of deficiencies) {
      if (namesMatch(d.name, deficiencyName)) return d.codeReference
    }
    // Fallback: search all inside categories with normalized name matching
    for (const insideCat of ALL_INSIDE_CATEGORIES) {
      if (
        cat.includes(normalise(insideCat.itemName)) ||
        normalise(insideCat.itemName).includes(cat)
      ) {
        const flatDefs = getInsideDeficienciesForItem(insideCat.itemName)
        for (const d of flatDefs) {
          if (namesMatch(d.name, deficiencyName)) return d.codeReference
        }
      }
    }
    return undefined
  }

  return undefined
}
