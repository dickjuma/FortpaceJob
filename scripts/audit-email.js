// scripts/audit-email.js
// Phase 1 – Audit direct email/notification calls
// Run with: npm run audit-email

const { globby } = require('globby');
const fs = require('fs');
const path = require('path');

// Patterns to detect direct email/notification usage
const PATTERNS = [
  /sendMail\s*\(/,
  /sendEmail\s*\(/,
  /transporter\.sendMail\s*\(/,
  /nodemailer/, /resend/, /mailgun/, /ses/, /postmark/, /smtp/, /direct\s+email/, /customMailHelper/, /notificationUtils\./
];

(async () => {
  try {
    const files = await globby([
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
      'server/**/*.js',
      'jobs/**/*.js'
    ], { gitignore: true });

    const results = [];
    for (const file of files) {
      const content = await fs.promises.readFile(file, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (PATTERNS.some(p => p.test(line))) {
          results.push({ file, lineNumber: idx + 1, snippet: line.trim() });
        }
      });
    }

    // Ensure artifacts directory exists
    const artifactsDir = path.resolve('artifacts');
    await fs.promises.mkdir(artifactsDir, { recursive: true });

    // Generate Markdown report
    const mdLines = [
      '# Email / Notification Direct Call Audit',
      '',
      'The following table lists every file line that directly triggers an email or notification without using the future centralized Notification Service.',
      '',
      '| File | Line | Snippet |',
      '|------|------|---------|'
    ];
    results.forEach(r => {
      const escaped = r.snippet.replace(/\|/g, '\\|'); // escape pipe characters
      mdLines.push('| ' + r.file + ' | ' + r.lineNumber + ' | `' + escaped + '` |');
    });
    const mdContent = mdLines.join('\n');
    await fs.promises.writeFile(path.join(artifactsDir, 'audit_report.md'), mdContent);

    console.log(`✅ Audit complete. Found ${results.length} occurrences.`);
    console.log(`Report written to ${path.join(artifactsDir, 'audit_report.md')}`);
  } catch (err) {
    console.error('Error during audit:', err);
    process.exit(1);
  }
})();
