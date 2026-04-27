import { ALL_OUTSIDE_DEFICIENCIES } from './outsideAppData';
import { ALL_INSIDE_CATEGORIES } from './unitAppData';

export interface DeficiencyDetail {
    id: string;
    selected: string;
    detail: string;
    criteria: string;
    codeAndCompliance: string;
    healthAndSafety: string;
    repairBy: string;
    notes?: string;
    location?: string;
    pointsFormula?: string;
    subcategory?: string;
}

/**
 * Helper to convert AppData deficiency options to the format used by the UI.
 */
function convertToUIDetail(d: any): DeficiencyDetail {
    return {
        id: d.id,
        selected: d.name,
        detail: d.detail,
        criteria: d.criteria,
        codeAndCompliance: d.code ? `NSPIRE - ${d.code}` : 'NSPIRE',
        healthAndSafety: d.severity,
        repairBy: d.repairBy,
        pointsFormula: d.points,
    };
}

// ── OUTSIDE DEFICIENCIES ──────────────────────────────────────────────────
// Populate outsideDeficiencyMapping dynamically from ALL_OUTSIDE_DEFICIENCIES
export const outsideDeficiencyMapping: Record<string, DeficiencyDetail[]> = {};

Object.keys(ALL_OUTSIDE_DEFICIENCIES).forEach(categoryName => {
    const item = ALL_OUTSIDE_DEFICIENCIES[categoryName];
    outsideDeficiencyMapping[categoryName] = item.deficiencies.map(convertToUIDetail);
});

// ── UNIT DEFICIENCIES (Mapped to insideDeficiencyMapping) ────────────────
// Populate insideDeficiencyMapping (which is used for UNIT section) from ALL_INSIDE_CATEGORIES
export const insideDeficiencyMapping: Record<string, DeficiencyDetail[]> = {};

ALL_INSIDE_CATEGORIES.forEach(item => {
    let allDefs: DeficiencyDetail[] = [];

    // Some items have flat deficiencies, some have subcategories
    if (item.deficiencies) {
        const mappedDefs = item.deficiencies.map(d => ({
            ...convertToUIDetail(d),
            selected: item.itemName,
            subcategory: item.itemName
        }));
        allDefs = [...allDefs, ...mappedDefs];
    }

    if (item.subcategories) {
        item.subcategories.forEach(sub => {
            const subName = (sub as any).name || (sub as any).itemName || item.itemName;
            const subDefs = sub.deficiencies.map(d => ({
                ...convertToUIDetail(d),
                selected: subName,
                subcategory: subName
            }));
            allDefs = [...allDefs, ...subDefs];
        });
    }

    insideDeficiencyMapping[item.itemName] = allDefs;
});
