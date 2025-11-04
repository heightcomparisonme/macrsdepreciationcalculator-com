// 西班牙语翻译文件验证脚本
// 运行: node scripts/verify-spanish-translations.js

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src/i18n');

// 检查文件是否存在
function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// 验证 JSON 文件是否有效
function validateJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

console.log('🔍 验证西班牙语翻译文件...\n');

const files = [
  // 主翻译文件
  { path: 'messages/es.json', name: '主翻译文件' },
  
  // 页面翻译
  { path: 'pages/comingsoon/es.json', name: 'Coming Soon 页面' },
  { path: 'pages/discord/es.json', name: 'Discord 页面' },
  { path: 'pages/featured-creations/es.json', name: '精选作品页面' },
  { path: 'pages/glossary/es.json', name: '词汇表页面' },
  { path: 'pages/hero/es.json', name: 'Hero 页面' },
  { path: 'pages/landing/es.json', name: '落地页' },
  { path: 'pages/onboarding/es.json', name: '入门页面' },
  { path: 'pages/pricing/es.json', name: '定价页面' },
  { path: 'pages/showcase/es.json', name: '展示页面' },
  
  // 工具翻译
  { path: 'pages/tools/example/es.json', name: '工具示例页面' },
];

let allValid = true;
const results = [];

files.forEach(({ path: filePath, name }) => {
  const fullPath = path.join(baseDir, filePath);
  
  if (!checkFileExists(fullPath)) {
    results.push({ name, status: '❌ 缺失', valid: false });
    allValid = false;
    return;
  }
  
  const validation = validateJson(fullPath);
  
  if (!validation.valid) {
    results.push({ 
      name, 
      status: `❌ JSON 无效: ${validation.error}`, 
      valid: false 
    });
    allValid = false;
  } else {
    const stats = fs.statSync(fullPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    results.push({ 
      name, 
      status: `✅ 有效 (${sizeKB} KB)`, 
      valid: true 
    });
  }
});

// 打印结果
console.log('📊 验证结果:\n');
results.forEach(({ name, status }) => {
  console.log(`${status.padEnd(30)} - ${name}`);
});

console.log('\n' + '='.repeat(60));

if (allValid) {
  console.log('\n✅ 所有西班牙语翻译文件都已创建且有效！');
  console.log('\n📝 下一步:');
  console.log('   1. 翻译 es.json 文件中的内容');
  console.log('   2. 测试访问 /es 路由');
  console.log('   3. 检查页面显示是否正常');
} else {
  console.log('\n❌ 发现问题，请检查上述文件');
  process.exit(1);
}

console.log('\n' + '='.repeat(60) + '\n');
