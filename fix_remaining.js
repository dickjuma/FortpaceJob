/**
 * fix_remaining.js
 * Fixes the remaining 7 files with corrupted template literals and missing state declarations
 */
const fs = require('fs');
const path = require('path');

function readFile(rel) { return fs.readFileSync(path.join(__dirname, rel), 'utf8'); }
function writeFile(rel, content) { fs.writeFileSync(path.join(__dirname, rel), content, 'utf8'); }

function fix(relPath, fixFn) {
  const content = readFile(relPath);
  const fixed = fixFn(content);
  if (fixed !== content) {
    writeFile(relPath, fixed);
    console.log(`✅ Fixed: ${relPath}`);
  } else {
    console.log(`⚠️  No change: ${relPath}`);
  }
}

// Converts broken escaped backtick strings \\`text\\` -> `text`
// Also fixes \\$ -> $ inside these strings
function fixEscapedBackticks(c) {
  // Pattern: \`...\`  (backslash before backtick used as string delimiter)
  // In the file these appear as literal backslash + backtick
  return c.replace(/\\`([^`]*?)\\`/g, (_, inner) => {
    // Fix any \\$ inside -> $ and \\{ -> {
    const fixed = inner.replace(/\\\$/g, '$').replace(/\\\{/g, '{');
    return '`' + fixed + '`';
  });
}

// ─── 1. ReviewsPage.jsx – missing [filter, setFilter] state ─────────────────
fix('src/client/pages/ReviewsPage.jsx', c => {
  if (!/const \[filter,/.test(c)) {
    // Insert after the component function opening brace
    c = c.replace(
      /export default function\s+\w+\s*\(\)\s*\{/,
      m => m + "\n  const [filter, setFilter] = useState('ALL');"
    );
  }
  return c;
});

// ─── 2. ClientApprovalChainsPage.jsx – corrupted template literals ───────────
fix('src/client/pages/ClientApprovalChainsPage.jsx', c => fixEscapedBackticks(c));

// ─── 3. ClientTimeTrackingPage.jsx – corrupted template literals ─────────────
fix('src/client/pages/ClientTimeTrackingPage.jsx', c => fixEscapedBackticks(c));

// ─── 4. ClientReviewsDirectory.jsx – invalid regex flag (unquoted path) ──────
fix('src/client/pages/ClientReviewsDirectory.jsx', c => {
  // Fix: apiFetch(/some/path/here) -> apiFetch('/some/path/here')
  // These have no quotes and babel interprets them as regex literals
  c = c.replace(/apiFetch\(\/([^/\n,)]+(?:\/[^,\n)]*)*)\)/g, (_, p) => {
    return `apiFetch('/${p}')`;
  });
  return fixEscapedBackticks(c);
});

// ─── 5. HireFreelancer.jsx – Unicode escape / corrupted template ─────────────
fix('src/client/pages/HireFreelancer.jsx', c => fixEscapedBackticks(c));

// ─── 6. InviteFreelancer.jsx – Unicode escape / corrupted template ───────────
fix('src/client/pages/InviteFreelancer.jsx', c => fixEscapedBackticks(c));

// ─── 7. ClientInterviewManagementPage.jsx – duplicate isScheduling ───────────
fix('src/client/pages/ClientInterviewManagementPage.jsx', c => {
  // Find all occurrences of the duplicate declaration
  const pattern = /const \[isScheduling,\s*setIsScheduling\]\s*=\s*useState\([^)]*\);/g;
  const matches = [...c.matchAll(pattern)];
  if (matches.length > 1) {
    // Remove the second (duplicate) occurrence
    const m = matches[1];
    c = c.slice(0, m.index) + c.slice(m.index + m[0].length);
    console.log('  Removed duplicate isScheduling declaration');
  }
  return c;
});

console.log('\nDone!');
