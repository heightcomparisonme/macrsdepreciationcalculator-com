const fs = require('fs');
const path = require('path');

const files = [
  'src/i18n/pages/workstation/en.json',
  'src/i18n/pages/workstation/de.json',
  'src/i18n/pages/workstation/es.json'
];

console.log('\n🔍 Verifying Workstation Translation Files\n');

files.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const json = JSON.parse(content);
    
    console.log(`✅ ${filePath}`);
    console.log(`   Root keys: ${Object.keys(json).join(', ')}`);
    
    if (json.workstation) {
      const workstationKeys = Object.keys(json.workstation);
      console.log(`   Workstation keys (${workstationKeys.length}): ${workstationKeys.slice(0, 5).join(', ')}...`);
    }
    
    const size = (content.length / 1024).toFixed(2);
    console.log(`   Size: ${size} KB\n`);
  } catch (e) {
    console.log(`❌ ${filePath}`);
    console.log(`   Error: ${e.message}\n`);
  }
});

console.log('✨ Verification complete!\n');
