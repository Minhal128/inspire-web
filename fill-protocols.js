const fs = require('fs');
const path = './lib/inspectionDeficiencies.json';
const data = JSON.parse(fs.readFileSync(path));

['outside', 'inside', 'unit'].forEach(section => {
  data[section].forEach(item => {
    if (!item.inspectionProtocol) {
      item.inspectionProtocol = `International (ICC) Protocol – ${item.category.replace(/^\d+\.\s*/, '')}\n\n1. Scope & Applicability\nInspection applies to all related components for ${item.deficiencySelected}.\n\n2. Condition & Hazards\nInspect for:\n• Proper functionality and condition\n• Secure mounting and intact components\n• No hazards, sharp edges, or safety risks\n\nHazard Severity:\n• Depending on the extent of the defect, it may be classified as Low, Moderate, Severe, or Life-Threatening according to NSPIRE standards.`;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully filled missing inspection protocols!');
