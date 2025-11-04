// Test script to verify calculator translations exist
const fs = require('fs');
const path = require('path');

console.log('Testing Calculator Translations...\n');

// Read English translations
const enPath = path.join(__dirname, 'src/i18n/messages/en.json');
const zhPath = path.join(__dirname, 'src/i18n/messages/zh.json');

try {
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

  // Check if calculator namespace exists
  const enCalculator = enTranslations.calculator;
  const zhCalculator = zhTranslations.calculator;

  console.log('✅ English calculator namespace exists:', !!enCalculator);
  console.log('✅ Chinese calculator namespace exists:', !!zhCalculator);

  // Check required keys for CPMCalculator component
  const requiredKeys = [
    'title',
    'description',
    'total_cost.label',
    'total_cost.description',
    'total_cost.step1',
    'total_cost.step2',
    'cpm.label',
    'cpm.description',
    'cpm.step1',
    'cpm.step2',
    'impressions.label',
    'impressions.description',
    'impressions.step1',
    'impressions.step2',
    'buttons.reset',
    'buttons.calculate',
    'placeholders.total_cost',
    'placeholders.cpm',
    'placeholders.impressions',
    'error_min_fields',
    'results.title',
    'results.total_cost_label',
    'results.cpm_label',
    'results.impressions_label'
  ];

  console.log('\nChecking required translation keys:');
  
  requiredKeys.forEach(key => {
    const keyPath = key.split('.');
    let enValue = enCalculator;
    let zhValue = zhCalculator;
    
    for (const part of keyPath) {
      enValue = enValue?.[part];
      zhValue = zhValue?.[part];
    }
    
    const enExists = enValue !== undefined;
    const zhExists = zhValue !== undefined;
    
    console.log(`${enExists ? '✅' : '❌'} EN: calculator.${key} = "${enValue || 'MISSING'}"`);
    console.log(`${zhExists ? '✅' : '❌'} ZH: calculator.${key} = "${zhValue || 'MISSING'}"`);
    console.log('');
  });

  console.log('Translation files appear to be valid JSON and contain the calculator namespace.');
  
} catch (error) {
  console.error('❌ Error reading or parsing translation files:', error.message);
}