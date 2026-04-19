const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Use Client if using hooks
      const needsUseClient = content.includes('useParams') || content.includes('useLocation') || content.includes('useNavigate') || content.includes("useState") || content.includes("useEffect");
      
      if (needsUseClient && !content.includes('"use client"')) {
        content = '"use client";\n' + content;
      }

      // Replace routing imports
      content = content.replace(/import \{(.*)Link(.*)\} from 'react-router';/g, "import Link from 'next/link';\nimport {$1$2} from 'react-router';");
      content = content.replace(/import \{(.*)useNavigate(.*)\} from 'react-router';/g, "import {$1useRouter as useNavigate$2} from 'next/navigation';");
      content = content.replace(/import \{(.*)useLocation(.*)\} from 'react-router';/g, "import {$1usePathname as useLocation$2} from 'next/navigation';");
      content = content.replace(/import \{(.*)useParams(.*)\} from 'react-router';/g, "import {$1useParams$2} from 'next/navigation';");
      
      // Clean up orphaned empty react-router imports
      content = content.replace(/import \{\s*\} from 'react-router';\n/g, '');
      content = content.replace(/import Link from 'react-router';/g, "import Link from 'next/link';");

      // Replace relative paths in index.tsx / app.tsx if needed
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Imports replaced successfully.');
