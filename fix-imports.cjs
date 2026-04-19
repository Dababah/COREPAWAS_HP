const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix the syntax error from the previous greedy regex
  content = content.replace(/import\s*\{\s*,\s*usePathname/g, 'import { usePathname');

  // Replace relative imports jumping out to components, data, context, UI
  content = content.replace(/from\s+['"](?:\.\.\/)+components\/(.*)['"]/g, "from '@/components/$1'");
  content = content.replace(/from\s+['"](?:\.\.\/)+data\/(.*)['"]/g, "from '@/data/$1'");
  content = content.replace(/from\s+['"](?:\.\.\/)+context\/(.*)['"]/g, "from '@/context/$1'");

  // Also catch direct imports to root level like css
  content = content.replace(/import\s+['"](?:\.\.\/)+index\.css['"]/g, "import '@/index.css'");

  fs.writeFileSync(file, content);
}
console.log('Fixed imports and syntax errors');
