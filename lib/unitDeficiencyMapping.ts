import { ALL_UNIT_CATEGORIES } from './unitAppData';
import { DeficiencyDetail } from './deficiencyMapping';

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
    };
}

// Populate unitDeficiencyMapping dynamically from ALL_UNIT_CATEGORIES
export const unitDeficiencyMapping: Record<string, DeficiencyDetail[]> = {};

ALL_UNIT_CATEGORIES.forEach(categoryObj => {
    categoryObj.items.forEach(item => {
        let allDefs: DeficiencyDetail[] = [];

        if (item.deficiencies) {
            allDefs = [...allDefs, ...item.deficiencies.map(convertToUIDetail)];
        }

        // Use a type cast or check if subcategories exist on the item
        const itemAny = item as any;
        if (itemAny.subcategories) {
            itemAny.subcategories.forEach((sub: any) => {
                allDefs = [...allDefs, ...sub.deficiencies.map(convertToUIDetail)];
            });
        }

        unitDeficiencyMapping[item.itemName] = allDefs;
    });
});
