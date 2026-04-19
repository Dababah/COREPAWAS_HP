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
  let original = content;

  // Replace <Link to= with <Link href=
  content = content.replace(/<Link\s+to=/g, '<Link href=');

  // Add React import if JSX is used in the markdown logic
  if (content.includes('JSX.Element') && !content.includes('import React')) {
    content = 'import React from "react";\n' + content;
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed Link props and JSX types');
