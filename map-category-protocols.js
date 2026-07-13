const fs = require('fs');
const path = './lib/inspectionDeficiencies.json';
const data = JSON.parse(fs.readFileSync(path));

let updatedCount = 0;

['outside', 'inside', 'unit'].forEach(section => {
  const categories = {};
  
  // First pass: find the real protocol for each category
  data[section].forEach(item => {
    if (item.inspectionProtocol) {
      // Check if it's a real protocol (not our generic placeholder)
      const isPlaceholder = item.inspectionProtocol.includes('Proper functionality and condition\n• Secure mounting');
      if (!isPlaceholder) {
        if (!categories[item.category] || item.inspectionProtocol.length > categories[item.category].length) {
          categories[item.category] = item.inspectionProtocol;
        }
      }
    }
  });

  // Second pass: apply the real protocol to all items in that category
  data[section].forEach(item => {
    if (categories[item.category]) {
      if (item.inspectionProtocol !== categories[item.category]) {
        item.inspectionProtocol = categories[item.category];
        updatedCount++;
      }
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Successfully mapped real protocols to ${updatedCount} items!`);
