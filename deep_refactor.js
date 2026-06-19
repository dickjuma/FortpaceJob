const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mappings = [
  { source: 'auth', target: 'platform/auth' },
  { source: 'search', target: 'platform/search' },
  { source: 'escrow', target: 'platform/escrow' },
  { source: 'verification', target: 'platform/verification' },
  { source: 'agency', target: 'freelancer/agency' },
  { source: 'modules/financial-control', target: 'admin/finance' },
  { source: 'pages/shared', target: 'platform/pages/shared' },
  { source: 'pages/gigs', target: 'client/pages/gigs' },
];

function moveDir(sourceRel, targetRel) {
  const sourcePath = path.join(srcDir, sourceRel);
  const targetPath = path.join(srcDir, targetRel);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`Source ${sourceRel} does not exist. Skipping.`);
    return;
  }
  
  // Ensure target parent dir exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  
  // Need to adjust internal relative imports BEFORE moving!
  const depthChange = targetRel.split('/').length - sourceRel.split('/').length;
  
  if (depthChange > 0) {
      console.log(`Patching internal depths for ${sourceRel} (+${depthChange} levels)`);
      const files = walkSync(sourcePath);
      files.forEach(file => {
          let content = fs.readFileSync(file, 'utf8');
          
          // Only patch imports that go OUTSIDE the directory
          // It's tricky to know if an import goes outside just by `../`. 
          // For example, in `src/auth/pages/Login.jsx`, `../components/Button` goes to `src/auth/components/Button` (stays inside).
          // But `../../components/Button` goes outside!
          // Actually, if the WHOLE folder `src/auth` moves to `src/platform/auth`, 
          // `../components/Button` from `src/auth/pages/Login.jsx` STILL goes to `src/platform/auth/components/Button`!
          // So relative imports INSIDE the moved folder are perfectly fine.
          // ONLY relative imports that break OUT of `src/auth` need an extra `../`.
          // How do we detect imports that break out of the folder?
          // If a file is at `src/auth/pages/Login.jsx` (level 2 from auth, i.e. auth is level 0).
          // `../` goes to `src/auth/`. `../../` goes to `src/`.
          // So `../../` breaks out. It must become `../../../`!
      });
  }
  
  console.log(`Moving ${sourceRel} -> ${targetRel}`);
  fs.renameSync(sourcePath, targetPath);
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
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js') || filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

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
        let importerMovingMap = mappings.find(m => file.startsWith(path.join(srcDir, path.normalize(m.source))));
        // Figure out if the imported target is moving
        let importedMovingMap = mappings.find(m => absoluteImportedPath.startsWith(path.join(srcDir, path.normalize(m.source))));

        let newImporterPath = file;
        if (importerMovingMap) {
            newImporterPath = file.replace(
                path.join(srcDir, path.normalize(importerMovingMap.source)), 
                path.join(srcDir, path.normalize(importerMovingMap.target))
            );
        }

        let newImportedPath = absoluteImportedPath;
        if (importedMovingMap) {
            newImportedPath = absoluteImportedPath.replace(
                path.join(srcDir, path.normalize(importedMovingMap.source)), 
                path.join(srcDir, path.normalize(importedMovingMap.target))
            );
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

// Also remove empty modules dir if empty
try {
    const modDir = path.join(srcDir, 'modules');
    if (fs.readdirSync(modDir).length === 0) {
        fs.rmdirSync(modDir);
    }
} catch (e) {}

// Also remove empty pages dir if empty
try {
    const pagesDir = path.join(srcDir, 'pages');
    if (fs.readdirSync(pagesDir).length === 0) {
        fs.rmdirSync(pagesDir);
    }
} catch (e) {}

console.log("Deep refactor completed.");
