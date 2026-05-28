const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove React.FC type annotations
  content = content.replace(/: React\.FC(<[^>]+>)?/g, '');
  content = content.replace(/import \{[^}]+\} from 'react';?/g, match => {
     if(match.includes('useState') || match.includes('useEffect') || match.includes('React')) return match;
     return ''; // Remove other type imports if any, but better just leave it
  });
  // Replace standard React.FC and props
  content = content.replace(/(\w+):\s*React\.FC<[^>]+>\s*=\s*\(([^)]*)\)/g, '$1 = ($2)');
  content = content.replace(/interface\s+\w+\s*{[^}]*}/g, '');
  content = content.replace(/type\s+\w+\s*=[^;]+;/g, '');
  // Remove variable types e.g., (props: ButtonProps) -> (props)
  content = content.replace(/\(\s*({[^}]+}|[\w]+)\s*:\s*[A-Z][a-zA-Z0-9_]*\s*\)/g, '($1)');

  // More aggressive type stripping
  content = content.replace(/<string \| null>/g, '');
  content = content.replace(/<string>/g, '');

  const newPath = file.replace('.tsx', '.jsx');
  fs.writeFileSync(newPath, content);
  fs.unlinkSync(file);
  console.log(`Converted ${file} to ${newPath}`);
});

console.log("Done");
