const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mappings = [
  { source: 'assets', target: 'platform/assets' },
  { source: 'channels', target: 'platform/channels' },
  { source: 'common', target: 'platform/common' },
  { source: 'components', target: 'platform/components' },
  { source: 'domain', target: 'platform/domain' },
  { source: 'layouts', target: 'platform/layouts' },
  { source: 'lib', target: 'platform/lib' },
  { source: 'notification', target: 'platform/notification' },
  { source: 'queues', target: 'platform/queues' },
  { source: 'services', target: 'platform/services' },
  { source: 'store', target: 'platform/store' },
  { source: 'templates', target: 'platform/templates' },
  { source: 'workers', target: 'platform/workers' },
  { source: 'pages/admin', target: 'admin/pages' },
  { source: 'pages/client', target: 'client/pages' },
  { source: 'pages/freelancer', target: 'freelancer/pages' },
  { source: 'pages/find-talent', target: 'client/pages/find-talent' },
  { source: 'pages/find-work', target: 'freelancer/pages/find-work' },
  { source: 'pages/auth', target: 'platform/auth/pages' },
  { source: 'modules/auth', target: 'platform/auth/modules' }
];

function moveRecursiveSync(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        for (const file of files) {
            moveRecursiveSync(path.join(src, file), path.join(dest, file));
        }
        fs.rmdirSync(src);
    } else {
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest); // Overwrite if exists, though shouldn't happen usually
        }
        fs.renameSync(src, dest);
    }
}

function moveDir(sourceRel, targetRel) {
  const sourcePath = path.join(srcDir, sourceRel);
  const targetPath = path.join(srcDir, targetRel);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`Source ${sourceRel} does not exist. Skipping.`);
    return;
  }
  
  // Ensure target parent dir exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  
  console.log(`Moving ${sourceRel} -> ${targetRel}`);
  moveRecursiveSync(sourcePath, targetPath);
}

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        filelist = walkSync(filepath, filelist);
      }
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js') || filepath.endsWith('.ts') || filepath.endsWith('.tsx') || filepath.endsWith('.css') || filepath.endsWith('.scss')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

console.log("Starting Total Collapse Refactor...");

// 1. We must read ALL files in the project first to find internal imports that break out of directories, and patch them BEFORE moving.
const allSourceFilesBeforeMove = walkSync(srcDir);

// Build a map of file absolute paths to their contents so we can update them in memory
const inMemoryFiles = {};
allSourceFilesBeforeMove.forEach(file => {
    inMemoryFiles[file] = fs.readFileSync(file, 'utf8');
});

// A helper function to compute relative paths
function resolveImportPath(importerPath, importStr) {
    if (!importStr.startsWith('.')) return null; // Not a relative import
    const dir = path.dirname(importerPath);
    return path.resolve(dir, importStr);
}

// Ensure the path mapping uses correct OS separators
const mappingsAbsolute = mappings.map(m => ({
    source: path.join(srcDir, path.normalize(m.source)),
    target: path.join(srcDir, path.normalize(m.target))
}));

// 2. Fix the imports in memory
Object.keys(inMemoryFiles).forEach(file => {
    let content = inMemoryFiles[file];
    let changed = false;

    // We use a regex to find all relative imports
    const importRegex = /(['"])(\.\.?\/[^'"]+)\1/g;
    
    content = content.replace(importRegex, (match, quote, importPath) => {
        const absoluteImportedPath = resolveImportPath(file, importPath);
        if (!absoluteImportedPath) return match;
        
        // Figure out if the importer is moving
        let importerMovingMap = mappingsAbsolute.find(m => file.startsWith(m.source + path.sep) || file === m.source);
        // Figure out if the imported target is moving
        let importedMovingMap = mappingsAbsolute.find(m => absoluteImportedPath.startsWith(m.source + path.sep) || absoluteImportedPath === m.source);

        let newImporterPath = file;
        if (importerMovingMap) {
            newImporterPath = file.replace(importerMovingMap.source, importerMovingMap.target);
        }

        let newImportedPath = absoluteImportedPath;
        if (importedMovingMap) {
            newImportedPath = absoluteImportedPath.replace(importedMovingMap.source, importedMovingMap.target);
        }

        // If either moved, we must recalculate the relative import!
        if (importerMovingMap || importedMovingMap) {
            let newRelative = path.relative(path.dirname(newImporterPath), newImportedPath);
            // path.relative on windows uses backslashes
            newRelative = newRelative.replace(/\\/g, '/');
            if (!newRelative.startsWith('.')) {
                newRelative = './' + newRelative;
            }
            changed = true;
            return `${quote}${newRelative}${quote}`;
        }

        return match;
    });

    if (changed) {
        inMemoryFiles[file] = content;
    }
});

// 3. Write back to disk (in original locations)
Object.keys(inMemoryFiles).forEach(file => {
    fs.writeFileSync(file, inMemoryFiles[file]);
});

// 4. Now move the directories
mappings.forEach(mapping => {
  moveDir(mapping.source, mapping.target);
});

// 5. Cleanup empty directories
const cleanDirs = ['pages', 'modules', 'public'];
cleanDirs.forEach(d => {
    try {
        const dPath = path.join(srcDir, d);
        if (fs.existsSync(dPath) && fs.readdirSync(dPath).length === 0) {
            fs.rmdirSync(dPath);
        }
    } catch (e) {}
});

console.log("Total Collapse Refactor completed.");
