/**
 * fix_all_errors.js
 * Fixes all remaining frontend build/lint errors:
 * 1. Missing @tanstack/react-query imports (useQuery, useMutation, useQueryClient)
 * 2. Missing react-router-dom imports (useParams)
 * 3. Missing useState declarations (filter, toast, formData, etc.)
 * 4. Parsing errors in specific files
 */
const fs = require('fs');
const path = require('path');

function readFile(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}
function writeFile(rel, content) {
  fs.writeFileSync(path.join(__dirname, rel), content, 'utf8');
}

function addImport(content, fromModule, namedImports) {
  // Check which named imports are already imported from this module
  const existingMatch = content.match(new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${fromModule.replace('/', '\\/')}['"]`));
  if (existingMatch) {
    const existing = existingMatch[1].split(',').map(s => s.trim());
    const toAdd = namedImports.filter(n => !existing.includes(n));
    if (toAdd.length === 0) return content;
    const newImports = [...existing, ...toAdd].join(', ');
    return content.replace(existingMatch[0], `import { ${newImports} } from '${fromModule}'`);
  }
  // Insert after first import line
  const firstImport = content.match(/^import .+$/m);
  if (firstImport) {
    const insertAfter = firstImport.index + firstImport[0].length;
    return content.slice(0, insertAfter) + '\n' + `import { ${namedImports.join(', ')} } from '${fromModule}';` + content.slice(insertAfter);
  }
  return `import { ${namedImports.join(', ')} } from '${fromModule}';\n` + content;
}

function fix(relPath, fixFn) {
  const content = readFile(relPath);
  const fixed = fixFn(content);
  if (fixed !== content) {
    writeFile(relPath, fixed);
    console.log(`✅ Fixed: ${relPath}`);
  } else {
    console.log(`⚠️  No change needed: ${relPath}`);
  }
}

// ─── 1. Files that only need @tanstack/react-query imports ─────────────────
const tanstackOnly = [
  { file: 'src/client/pages/ClientAgencyManagementPage.jsx',   needs: ['useQuery'] },
  { file: 'src/client/pages/ClientContractBuilderPage.jsx',    needs: ['useMutation'] },
  { file: 'src/client/pages/ClientErpSystemsPage.jsx',         needs: ['useQuery'] },
  { file: 'src/client/pages/ClientOfflineMapPage.jsx',         needs: ['useQuery'] },
  { file: 'src/client/pages/ClientRoiAnalyticsPage.jsx',       needs: ['useQuery'] },
  { file: 'src/client/pages/ClientSetupWizard.jsx',            needs: ['useMutation'] },
  { file: 'src/client/pages/ClientVerifyOtpPage.jsx',          needs: ['useMutation'] },
  { file: 'src/client/pages/ClientWelcomePage.jsx',            needs: ['useMutation'] },
  { file: 'src/client/pages/ClientCompanyProfilePage.jsx',     needs: ['useQuery', 'useMutation', 'useQueryClient'] },
  { file: 'src/client/pages/ClientCompliancePage.jsx',         needs: ['useQuery', 'useMutation', 'useQueryClient'] },
  { file: 'src/client/pages/ClientProcurementEcosystemPage.jsx', needs: ['useQuery', 'useMutation', 'useQueryClient'] },
  { file: 'src/client/pages/ClientWorkflowBuilderPage.jsx',    needs: ['useQuery', 'useMutation', 'useQueryClient'] },
];

tanstackOnly.forEach(({ file, needs }) => {
  fix(file, c => addImport(c, '@tanstack/react-query', needs));
});

// ─── 2. ClientTaskWorkspacePage needs useQuery from tanstack AND useParams from router ──
fix('src/client/pages/ClientTaskWorkspacePage.jsx', c => {
  c = addImport(c, '@tanstack/react-query', ['useQuery']);
  c = addImport(c, 'react-router-dom', ['useParams']);
  return c;
});

// ─── 3. ClientFinancialDashboard.jsx – missing useState vars and toast ──────
fix('src/client/pages/ClientFinancialDashboard.jsx', c => {
  // Add toast import if missing
  if (!/import toast/.test(c)) {
    c = addImport(c, 'react-hot-toast', ['toast']);
  }
  // Add missing useState vars: txPage, itemsPerPage
  // Find the useState block in the component and add after it
  if (!/const \[txPage/.test(c)) {
    c = c.replace(
      /const \[([^\]]+)\] = useState\(/,
      m => `const [txPage, setTxPage] = useState(1);\n  const [itemsPerPage] = useState(10);\n  const [toast_dummy, setToast_dummy] = useState(null); // placeholder\n  ${m}`
    );
    // Replace setToast with toast calls (already using react-hot-toast)
    c = c.replace(/setToast\(/g, '(__setToast__(');
    // Remove the placeholder references
    c = c.replace(/const \[toast_dummy, setToast_dummy\].*\n/g, '');
  }
  // If setToast is still referenced, replace with toast.success / toast.error patterns
  if (/setToast\(/.test(c)) {
    c = c.replace(/setToast\(\{[^}]*type:\s*['"]error['"][^}]*message:\s*([^}]+)\}\)/g, 'toast.error($1)');
    c = c.replace(/setToast\(\{[^}]*message:\s*([^}]+)\}\)/g, 'toast.success($1)');
    c = c.replace(/setToast\(null\)/g, '/* cleared toast */');
  }
  return c;
});

// ─── 4. ClientInvoicesPage.jsx – same pattern as financial dashboard ─────────
fix('src/client/pages/ClientInvoicesPage.jsx', c => {
  if (!/import.*useQuery/.test(c)) c = addImport(c, '@tanstack/react-query', ['useQuery', 'useMutation', 'useQueryClient']);
  if (!/import toast/.test(c)) c = addImport(c, 'react-hot-toast', ['toast']);
  if (/setToast\(/.test(c)) {
    c = c.replace(/setToast\(\{[^}]*type:\s*['"]error['"][^}]*message:\s*([^}]+)\}\)/g, 'toast.error($1)');
    c = c.replace(/setToast\(\{[^}]*message:\s*([^}]+)\}\)/g, 'toast.success($1)');
    c = c.replace(/setToast\(null\)/g, '/* cleared toast */');
  }
  return c;
});

// ─── 5. RecommendationProfilePage.jsx – missing formData state and toast ────
fix('src/client/pages/RecommendationProfilePage.jsx', c => {
  if (!/import toast/.test(c)) c = addImport(c, 'react-hot-toast', ['toast']);
  // Add formData + setFormData useState if missing
  if (!/const \[formData/.test(c)) {
    // Find the component function body opening
    c = c.replace(
      /const [A-Za-z]+ = \(\) => \{/,
      m => m + '\n  const [formData, setFormData] = useState({});'
    );
  }
  if (/showToast\(/.test(c)) {
    c = c.replace(/showToast\(['"]error['"],\s*([^)]+)\)/g, 'toast.error($1)');
    c = c.replace(/showToast\([^,]+,\s*([^)]+)\)/g, 'toast.success($1)');
  }
  return c;
});

// ─── 6. ReviewsPage.jsx – missing filter state ──────────────────────────────
fix('src/client/pages/ReviewsPage.jsx', c => {
  if (!/const \[filter/.test(c)) {
    c = c.replace(
      /const [A-Za-z]+ = \(\) => \{/,
      m => m + '\n  const [filter, setFilter] = useState(\'all\');'
    );
  }
  return c;
});

// ─── 7. ClientApprovalChainsPage.jsx – Parsing error: Unicode escape ────────
fix('src/client/pages/ClientApprovalChainsPage.jsx', c => {
  // Remove any stray backslash-dollar sequences
  return c.replace(/\\[\$\{]/g, match => match === '\\$' ? '$' : '{');
});

// ─── 8. ClientTimeTrackingPage.jsx – Unicode escape parsing error ────────────
fix('src/client/pages/ClientTimeTrackingPage.jsx', c => {
  return c.replace(/\\[\$\{]/g, match => match === '\\$' ? '$' : '{');
});

// ─── 9. ClientReviewsDirectory.jsx – Invalid regex flag ─────────────────────
fix('src/client/pages/ClientReviewsDirectory.jsx', c => {
  // Find pattern like /something/flag where it's used as an argument, not a real regex
  return c.replace(/apiFetch\(\/([^/\n]+)\/([^,\n)]+)\)/g, (m, path, rest) => {
    if (/[a-z]/.test(rest)) return `apiFetch('/${path}/${rest}')`;
    return m;
  });
});

// ─── 10. HireFreelancer.jsx & InviteFreelancer.jsx – Unicode escape errors ──
['src/client/pages/HireFreelancer.jsx', 'src/client/pages/InviteFreelancer.jsx'].forEach(f => {
  fix(f, c => c.replace(/\\[\$\{]/g, match => match === '\\$' ? '$' : '{'));
});

// ─── 11. ClientInterviewManagementPage.jsx – duplicate identifier ────────────
fix('src/client/pages/ClientInterviewManagementPage.jsx', c => {
  // Find duplicate isScheduling declarations and remove the second one
  const matches = [...c.matchAll(/const \[isScheduling,\s*setIsScheduling\]\s*=\s*useState\([^)]*\);/g)];
  if (matches.length > 1) {
    // Remove the second occurrence
    const second = matches[1];
    c = c.slice(0, second.index) + c.slice(second.index + second[0].length);
  }
  return c;
});

console.log('\n✅ All fixes applied!');
