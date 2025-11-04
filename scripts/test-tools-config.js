const fs = require('fs');
const path = require('path');

console.log('\n🔍 Testing Dynamic Tools Configuration\n');

// 1. Check if tools directory exists
const toolsPath = path.join(process.cwd(), 'src', 'app', '[locale]', '(default)', 'tools');
console.log('📁 Tools Directory:', toolsPath);

if (!fs.existsSync(toolsPath)) {
  console.log('❌ Tools directory not found!');
  process.exit(1);
}

console.log('✅ Tools directory exists\n');

// 2. Discover tools from file system
const entries = fs.readdirSync(toolsPath, { withFileTypes: true });
const toolFolders = entries
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

console.log('🔎 Discovered Tool Folders:');
toolFolders.forEach((folder, index) => {
  const folderPath = path.join(toolsPath, folder);
  const hasPageFile = fs.existsSync(path.join(folderPath, 'page.tsx'));
  console.log(`  ${index + 1}. ${folder}${hasPageFile ? ' ✅ (has page.tsx)' : ' ⚠️  (missing page.tsx)'}`);
});

if (toolFolders.length === 0) {
  console.log('  (none found)');
}

console.log(`\n📊 Total discovered: ${toolFolders.length} tool(s)\n`);

// 3. Check tools-config.ts
const configPath = path.join(process.cwd(), 'src', 'lib', 'tools-config.ts');
console.log('📄 Configuration File:', configPath);

if (!fs.existsSync(configPath)) {
  console.log('❌ tools-config.ts not found!');
  process.exit(1);
}

const configContent = fs.readFileSync(configPath, 'utf8');

// Check if it contains the dynamic discovery code
if (configContent.includes('discoverTools') && configContent.includes('generateToolsConfig')) {
  console.log('✅ Dynamic configuration detected\n');
} else {
  console.log('⚠️  Configuration appears to be static\n');
}

// 4. Count overrides
const overridesMatch = configContent.match(/const TOOL_OVERRIDES[\s\S]*?= {([\s\S]*?)};/);
if (overridesMatch) {
  // Count entries in TOOL_OVERRIDES (rough estimate)
  const overridesContent = overridesMatch[1];
  const overrideCount = (overridesContent.match(/"[^"]+": {/g) || []).length;
  console.log(`🎨 Custom Overrides: ${overrideCount} tool(s) configured\n`);
}

// 5. Summary
console.log('📋 Summary:');
console.log(`  • File system tools: ${toolFolders.length}`);
console.log(`  • Configuration: ${configContent.includes('discoverTools') ? 'Dynamic ✅' : 'Static ⚠️'}`);
console.log(`  • Mode: ${configContent.includes('fs.readdirSync') ? 'Auto-discovery enabled 🚀' : 'Manual mode'}`);

console.log('\n💡 To add a new tool:');
console.log('  1. Create folder: src/app/[locale]/(default)/tools/your-tool-name/');
console.log('  2. Add page.tsx in the folder');
console.log('  3. (Optional) Add custom config to TOOL_OVERRIDES in tools-config.ts');
console.log('  4. Restart dev server\n');

console.log('✨ Test complete!\n');
