/**
 * fix_final.js
 * Fixes the last 6 files with specific, targeted replacements
 */
const fs = require('fs');
const path = require('path');

function fix(relPath, fixFn) {
  const fullPath = path.join(__dirname, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const fixed = fixFn(content);
  if (fixed !== content) {
    fs.writeFileSync(fullPath, fixed, 'utf8');
    console.log(`✅ Fixed: ${relPath}`);
  } else {
    console.log(`⚠️  No change: ${relPath}`);
  }
}

// ─── 1. ClientApprovalChainsPage.jsx ────────────────────────────────────────
// Line 36: toast.success(\Budget authorization successful! Escrow contract initialized. ??\);
// The \...\ is a broken backtick string that should be: `Budget authorization successful!...`
fix('src/client/pages/ClientApprovalChainsPage.jsx', c => {
  // Pattern: \sometext\ (backslash used as backtick)
  return c.replace(/\\([^\\]+)\\(?=[;,\)])/g, (match, inner) => {
    return '`' + inner + '`';
  });
});

// ─── 2. ClientTimeTrackingPage.jsx ──────────────────────────────────────────
// Line 39: showToast('success', \Time log approved! Payment scheduled.\);
fix('src/client/pages/ClientTimeTrackingPage.jsx', c => {
  // Replace showToast('success', \text\) -> toast.success(`text`)
  // Also fix other showToast patterns
  c = c.replace(/showToast\('success',\s*\\([^\\]+)\\\)/g, "toast.success(`$1`)");
  c = c.replace(/showToast\('error',\s*\\([^\\]+)\\\)/g, "toast.error(`$1`)");
  c = c.replace(/showToast\(['"]success['"],\s*\\([^\\]+)\\\)/g, "toast.success(`$1`)");
  c = c.replace(/showToast\(['"]error['"],\s*\\([^\\]+)\\\)/g, "toast.error(`$1`)");
  // If showToast is still used, add toast import if missing
  if (/toast\./.test(c) && !/import toast/.test(c)) {
    c = c.replace(/^(import React)/m, "import toast from 'react-hot-toast';\n$1");
  }
  return c;
});

// ─── 3. HireFreelancer.jsx ──────────────────────────────────────────────────
// Line 100: selectedJob.budgetLabel || \KES \ + (selectedJob.budgetMin || 0)
// Should be: selectedJob.budgetLabel || `KES ${selectedJob.budgetMin || 0}`
fix('src/client/pages/HireFreelancer.jsx', c => {
  // Fix: \KES \ + (value) -> `KES ${value}`
  c = c.replace(/\\KES\s*\\\s*\+\s*\(([^)]+)\)/g, (_, val) => '`KES ${' + val.trim() + '}`');
  // General fix for \text\ patterns
  c = c.replace(/\|\|\s*\\([^\\]+)\\\s*\+/g, (_, inner) => `|| \`${inner}\` +`);
  return c;
});

// ─── 4. InviteFreelancer.jsx ────────────────────────────────────────────────
// Line 61: job.budgetLabel || \KES \ + (job.budgetMin || 0)
fix('src/client/pages/InviteFreelancer.jsx', c => {
  c = c.replace(/\\KES\s*\\\s*\+\s*\(([^)]+)\)/g, (_, val) => '`KES ${' + val.trim() + '}`');
  c = c.replace(/\|\|\s*\\([^\\]+)\\\s*\+/g, (_, inner) => `|| \`${inner}\` +`);
  return c;
});

// ─── 5. ClientInterviewManagementPage.jsx ───────────────────────────────────
// Lines 182-184: `const isScheduling = scheduleMutation.isPending;` appears at top level
// But lines 185-186 are orphaned from a try block that got accidentally cut
// The real fix: wrap lines 185+ back into the proper function context
fix('src/client/pages/ClientInterviewManagementPage.jsx', c => {
  const lines = c.split('\n');
  // Find all isScheduling declarations
  const indices = lines.reduce((acc, l, i) => {
    if (/const isScheduling\s*=/.test(l)) acc.push(i);
    return acc;
  }, []);
  if (indices.length > 1) {
    // Remove the second (duplicate) - it's lines[indices[1]]
    lines.splice(indices[1], 1);
    console.log('  Removed duplicate isScheduling at line ' + (indices[1]+1));
  }
  return lines.join('\n');
});

// ─── 6. ClientReviewsDirectory.jsx ──────────────────────────────────────────
// Line 41: <Link to={/client/profile/} ...> - unquoted regex-like path
fix('src/client/pages/ClientReviewsDirectory.jsx', c => {
  // Fix JSX attributes: to={/some/path/} -> to="/some/path/"  (or template if dynamic)
  c = c.replace(/to=\{\/([^}]+)\/\}/g, (match, inner) => {
    // If inner contains variable references (letters before /), keep as template
    if (/\$\{/.test(inner)) return match;
    // Static path - just quote it
    return `to="/${inner}/"`;
  });
  // Also fix href={/path/} patterns
  c = c.replace(/href=\{\/([^}]+)\/\}/g, (_, inner) => `href="/${inner}/"`);
  return c;
});

console.log('\n✅ Final fixes complete!');
