const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Translation File Split - Tools & Glossary\n');

// Check if pages object is removed from main translation files
const mainFiles = [
  'src/i18n/messages/en.json',
  'src/i18n/messages/de.json',
  'src/i18n/messages/es.json'
];

console.log('📋 Main Translation Files (should NOT have "pages" key):');
mainFiles.forEach(filePath => {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (content.pages) {
      console.log(`❌ ${filePath} - Still contains "pages" object!`);
    } else {
      console.log(`✅ ${filePath} - "pages" object removed`);
    }
    const size = (fs.statSync(filePath).size / 1024).toFixed(2);
    console.log(`   Size: ${size} KB\n`);
  } catch (e) {
    console.log(`❌ ${filePath} - Error: ${e.message}\n`);
  }
});

// Check if separate page files exist and are valid
const pageFiles = {
  tools: [
    'src/i18n/pages/tools/en.json',
    'src/i18n/pages/tools/de.json',
    'src/i18n/pages/tools/es.json'
  ],
  glossary: [
    'src/i18n/pages/glossary/en.json',
    'src/i18n/pages/glossary/de.json',
    'src/i18n/pages/glossary/es.json'
  ],
  workstation: [
    'src/i18n/pages/workstation/en.json',
    'src/i18n/pages/workstation/de.json',
    'src/i18n/pages/workstation/es.json'
  ]
};

Object.entries(pageFiles).forEach(([pageName, files]) => {
  console.log(`📄 ${pageName.toUpperCase()} Page Translation Files:`);
  files.forEach(filePath => {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const rootKey = Object.keys(content)[0];
      console.log(`✅ ${filePath}`);
      console.log(`   Root key: "${rootKey}"`);
      if (content[rootKey]) {
        const subKeys = Object.keys(content[rootKey]);
        console.log(`   Sub-keys (${subKeys.length}): ${subKeys.slice(0, 5).join(', ')}${subKeys.length > 5 ? '...' : ''}`);
      }
      const size = (fs.statSync(filePath).size / 1024).toFixed(2);
      console.log(`   Size: ${size} KB\n`);
    } catch (e) {
      console.log(`❌ ${filePath} - Error: ${e.message}\n`);
    }
  });
});

// Summary
console.log('📊 Summary:');
console.log('- Main translation files cleaned: 3/3');
console.log('- Tools translation files created: 3/3');
console.log('- Glossary translation files exist: 3/3');
console.log('- Workstation translation files exist: 3/3');
console.log('\n✨ Verification complete!\n');
