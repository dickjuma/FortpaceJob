const fs = require('fs');
const path = require('path');

function fixFile(relPath, fixFn) {
  const fullPath = path.join(__dirname, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const fixed = fixFn(content);
  if (fixed !== content) {
    fs.writeFileSync(fullPath, fixed, 'utf8');
    console.log(`✅ Fixed: ${relPath}`);
  } else {
    console.log(`⚠️  No change: ${relPath}`);
  }
}

// 1. TalentShortlist.jsx – broken hourlyRate template literal
fixFile('src/client/pages/TalentShortlist.jsx', (c) => {
  // Replace any corrupt hourlyRate value with a proper template literal
  return c.replace(
    /hourlyRate:\s*c\.bidAmount\s*\?\s*[^\n]+\s*:\s*['"][^'"]*['"]/,
    "hourlyRate: c.bidAmount ? `$${c.bidAmount}` : '-'"
  );
});

// 2. clientApi.js – regex-literal-style path strings
fixFile('src/client/services/clientApi.js', (c) => {
  // getClientPublicProfile uses /profilesystem/client/public/ as regex
  c = c.replace(
    /return apiFetch\(\/profilesystem\/client\/public\/\)/g,
    'return apiFetch(`/profilesystem/client/public/${id}`)'
  );
  // inviteFreelancer uses /jobs/ and /invite as regex fragments
  c = c.replace(
    /return apiFetch\(\/jobs\/ \+ jobId \+ \/invite,/g,
    'return apiFetch(`/jobs/${jobId}/invite`,'
  );
  return c;
});

// 3. SharedProjectsPage.jsx – setProjects line is commented out, leaving orphaned .map body
fixFile('src/freelancer/agency/pages/SharedProjectsPage.jsx', (c) => {
  // The opening of setProjects is commented, but the body + closing are not
  // Replace the orphaned block with the full working version
  c = c.replace(
    /\/\/ setProjects\(projects\.map\(p => \{[\s\S]+?return p;\n\s+\}\)\);/,
    `setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const nextProgress = Math.min(p.progress + 10, 100);
        if (nextProgress === 100) {
          toast.success(\`Project "\${p.name}" has reached 100% completion!\`);
        } else {
          toast.success(\`Simulated progress update for "\${p.name}"\`);
        }
        return { ...p, progress: nextProgress };
      }
      return p;
    }));`
  );
  return c;
});

// 4. ViewApplications.jsx – useJobProposals -> useProposalsForJob
fixFile('src/freelancer/pages/find-work/ViewApplications.jsx', (c) => {
  return c.replace(
    /import \{ useJobProposals,/g,
    'import { useProposalsForJob as useJobProposals,'
  );
});

// 5. WorkAgreement.jsx – useJobProposals -> useProposalsForJob
fixFile('src/freelancer/pages/find-work/WorkAgreement.jsx', (c) => {
  return c.replace(
    /import \{ useJobProposals,/g,
    'import { useProposalsForJob as useJobProposals,'
  );
});

console.log('\nDone! All targeted fixes applied.');
