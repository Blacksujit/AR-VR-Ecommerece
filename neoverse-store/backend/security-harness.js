#!/usr/bin/env node

/**
 * Deterministic baseline security scanner for the NeoVerse repository.
 *
 * This is a candidate generator, not a vulnerability verdict. Every finding
 * must be independently validated against the current code and deployment
 * configuration before it becomes an actionable security issue.
 */

const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repositoryRoot, 'security-findings.json');

const ignoredFileNames = new Set([
  '.env',
  '.env.local',
  'security-findings.json',
]);

const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.vercel',
  '.agents',
  '.claude',
  'node_modules',
  'dist',
  'build',
]);

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.json',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

function walk(currentPath, files = []) {
  for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name) || ignoredFileNames.has(entry.name)) continue;

    const absolutePath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath, files);
      continue;
    }

    if (textExtensions.has(path.extname(entry.name).toLowerCase()) || entry.name.startsWith('.env')) {
      files.push(absolutePath);
    }
  }

  return files;
}

function relativePath(absolutePath) {
  return path.relative(repositoryRoot, absolutePath).replaceAll(path.sep, '/');
}

function addFinding(findings, file, line, rule, severity, message, evidence) {
  findings.push({
    id: `${rule}:${relativePath(file)}:${line}`,
    rule,
    severity,
    status: 'candidate',
    file: relativePath(file),
    line,
    message,
    evidence: evidence.trim().slice(0, 240),
    validation: 'Confirm the value is real, reachable, and exposed in the deployed environment before filing as a vulnerability.',
  });
}

function scanFile(file, findings) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const fileName = path.basename(file);
  const isExample = fileName.includes('.example') || fileName === '.env.example';

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (!isExample && file !== __filename && /firebase-adminsdk-[^\s/]+\.json/i.test(line)) {
      addFinding(
        findings,
        file,
        lineNumber,
        'SEC-001',
        'critical',
        'A Firebase service-account filename is present in a non-example file.',
        line
      );
    }

    if (file !== __filename && /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/.test(line)) {
      addFinding(
        findings,
        file,
        lineNumber,
        'SEC-002',
        'critical',
        'A private key marker is present in repository text.',
        line
      );
    }

    if (!isExample && file !== __filename && /(sk_live_|sk_test_|rk_live_|AIza[0-9A-Za-z_-]{20,}|xox[baprs]-)/.test(line)) {
      addFinding(
        findings,
        file,
        lineNumber,
        'SEC-003',
        'high',
        'A provider credential pattern is present in a non-example file.',
        line
      );
    }

    if (/cb\(null, true\).*Allow all in dev/i.test(line)) {
      addFinding(
        findings,
        file,
        lineNumber,
        'SEC-004',
        'high',
        'CORS appears to allow unknown origins instead of failing closed.',
        line
      );
    }

    if (/process\.env\.(STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|ANTHROPIC_API_KEY|OPENAI_API_KEY|GEMINI_API_KEY)/.test(line) && /console\.(log|info|debug|error)/.test(line)) {
      addFinding(
        findings,
        file,
        lineNumber,
        'SEC-005',
        'high',
        'A sensitive provider environment variable may be written to logs.',
        line
      );
    }
  });
}

const findings = [];
for (const file of walk(repositoryRoot)) {
  scanFile(file, findings);
}

const result = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  repository: path.basename(repositoryRoot),
  source: 'deterministic-baseline-scanner',
  disclaimer: 'Candidates require independent validation; pattern matches are not vulnerability verdicts.',
  summary: {
    candidates: findings.length,
    critical: findings.filter((finding) => finding.severity === 'critical').length,
    high: findings.filter((finding) => finding.severity === 'high').length,
    medium: findings.filter((finding) => finding.severity === 'medium').length,
    low: findings.filter((finding) => finding.severity === 'low').length,
  },
  findings,
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Security scan complete: ${findings.length} candidate finding(s)`);
console.log(`Report: ${path.relative(process.cwd(), outputPath)}`);
