const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (
    content.includes('SafeAreaView') &&
    content.match(/import\s+{.*SafeAreaView.*}\s+from\s+['"]react-native['"]/)
  ) {
    content = content.replace(
      /import\s+({[^}]*})\s+from\s+['"]react-native['"]/g,
      (match, p1) => {
        let newP1 = p1
          .replace(/,\s*SafeAreaView/, '')
          .replace(/SafeAreaView\s*,/, '')
          .replace(/SafeAreaView/, '')
          .trim();
        
        if (newP1 === '{}') {
          return `import { SafeAreaView } from 'react-native-safe-area-context';`;
        }
        return `import ${newP1} from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';`;
      }
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
