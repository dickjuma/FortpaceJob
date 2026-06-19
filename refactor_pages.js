const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const publicPagesDir = path.join(srcDir, 'public', 'pages');

const dirs = {
  platform: path.join(srcDir, 'platform', 'pages'),
  client: path.join(srcDir, 'client', 'pages'),
  freelancer: path.join(srcDir, 'freelancer', 'pages'),
  admin: path.join(srcDir, 'admin', 'pages'),
};

// Ensure directories exist
Object.values(dirs).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const fileMap = {}; // Tracks old location to new location (relative to src)
const deletes = ['Home.jsx', 'FreelancerProfile.jsx', 'SearchResults.jsx'];
const replacements = {
  'Home': 'GlobalHomepage',
  'FreelancerProfile': 'ProfilePage',
  'SearchResults': 'GlobalSearchPage',
  'PublicClientProfilePage': 'ClientPublicProfile', // If we delete PublicClientProfilePage, route it to ClientPublicProfile
  'PublicFreelancerProfilePage': 'ProfilePage'
};

const clientFiles = [
  'ClientHiringDashboard.jsx', 'ClientOnboardingLanding.jsx', 
  'ClientPublicProfile.jsx', 'ClientReviewsDirectory.jsx', 
  'HireFreelancer.jsx', 'InviteFreelancer.jsx', 
  'CreateOffer.jsx', 'ContractPreview.jsx', 
  'EnterpriseHiring.jsx', 'ManagedTeams.jsx', 
  'TalentShortlist.jsx'
];

const freelancerFiles = [
  'FreelancerDiscoveryAi.jsx', 'FreelancerDiscoveryMap.jsx', 
  'FreelancerLeaderboard.jsx', 'FreelancerOnboardingLanding.jsx', 
  'FreelancerSuccessScore.jsx', 'FreelancerVideoFeeds.jsx', 
  'PortfolioGallery.jsx', 'PortfolioShowcase.jsx'
];

function determineTarget(filename) {
  if (clientFiles.includes(filename)) return { dir: dirs.client, prefix: 'client/pages' };
  if (freelancerFiles.includes(filename)) return { dir: dirs.freelancer, prefix: 'freelancer/pages' };
  return { dir: dirs.platform, prefix: 'platform/pages' };
}

function processDirectory(directory, sourcePrefix) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    if (!fs.statSync(fullPath).isFile()) return;

    const baseName = path.basename(file, '.jsx');
    
    // Check if we should delete
    if (deletes.includes(file)) {
      console.log(`Deleting ${file}`);
      fs.unlinkSync(fullPath);
      fileMap[`${sourcePrefix}/${baseName}`] = `platform/pages/${replacements[baseName]}`;
      if (baseName === 'FreelancerProfile') {
        fileMap[`${sourcePrefix}/${baseName}`] = `freelancer/pages/${replacements[baseName]}`;
      }
      return;
    }

    if (file === 'PublicClientProfilePage.jsx' || file === 'PublicFreelancerProfilePage.jsx') {
      console.log(`Deleting ${file}`);
      fs.unlinkSync(fullPath);
      fileMap[`${sourcePrefix}/${baseName}`] = `client/pages/ClientPublicProfile`;
      if (file === 'PublicFreelancerProfilePage.jsx') {
        fileMap[`${sourcePrefix}/${baseName}`] = `freelancer/pages/ProfilePage`;
      }
      return;
    }

    const { dir, prefix } = determineTarget(file);
    const targetPath = path.join(dir, file);
    
    console.log(`Moving ${file} to ${prefix}`);
    
    // Read the file before moving it to patch internal imports if moving from depth 1 to depth 2
    if (sourcePrefix === 'pages') {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace all '../' with '../../' because depth goes from src/pages -> src/domain/pages
      // Replace all './' with '../' if they import another page? No, if another page moves to the same domain, './' is fine.
      // If it moves to a different domain, the import will be broken. We will rely on global patching for that.
      // But for things like `../components`, we must make them `../../components`
      content = content.replace(/(['"])\.\.\//g, '$1../../');
      fs.writeFileSync(fullPath, content);
    }

    fs.renameSync(fullPath, targetPath);
    
    // Register the mapping for import updates
    fileMap[`${sourcePrefix}/${baseName}`] = `${prefix}/${baseName}`;
  });
}

// Process both pages and public/pages
processDirectory(pagesDir, 'pages');
processDirectory(publicPagesDir, 'public/pages');

// Update imports globally
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        filelist = walkSync(filepath, filelist);
      }
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

const allFiles = walkSync(srcDir);

allFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  Object.keys(fileMap).forEach((oldPrefix) => {
    const newPrefix = fileMap[oldPrefix];
    
    // We will replace `/pages/Name'` and `/public/pages/Name'` 
    // And also `import Name from './Name'` inside the same folder if it moved.
    
    // 1. standard imports from outside:
    const searchString1 = `pages/${oldPrefix.split('/').pop()}`;
    if (content.includes(searchString1) && !content.includes(newPrefix)) {
        // This regex looks for `.../pages/Name` and replaces with `.../newPrefix/Name`
        const regex1 = new RegExp(`((\\.\\/|\\.\\.\\/)+)${oldPrefix.replace('/', '\\/')}(['"])`, 'g');
        content = content.replace(regex1, `$1${newPrefix}$3`);
        changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in ${file}`);
  }
});

// Remove empty directories
try { fs.rmdirSync(publicPagesDir); } catch(e){}
try { fs.rmdirSync(pagesDir); } catch(e){}

console.log('Restructure complete.');
