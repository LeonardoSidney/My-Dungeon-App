const { execFileSync } = require('node:child_process');
const path = require('node:path');

const COVERAGE_SUMMARY_PATH = path.resolve(__dirname, '../coverage/coverage-summary.json');
const COVERAGE_METRICS = ['statements', 'branches', 'functions', 'lines'];

function getStagedFiles () {
    const stagedFiles = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { encoding: 'utf8' });

    return stagedFiles.split('\0').filter(Boolean);
}

function getMissingMetrics (fileCoverage) {
    return COVERAGE_METRICS.filter(metric => fileCoverage[metric].covered < fileCoverage[metric].total);
}

function describeMissingMetric (fileCoverage, metric) {
    const { covered, total } = fileCoverage[metric];

    return `${metric} ${covered}/${total}`;
}

function describeIncompleteFile (coverageSummary, file) {
    const fileCoverage = coverageSummary[path.resolve(file)];
    if (!fileCoverage) {
        return null;
    }

    const missingMetrics = getMissingMetrics(fileCoverage);
    if (missingMetrics.length === 0) {
        return null;
    }

    const metrics = missingMetrics.map(metric => describeMissingMetric(fileCoverage, metric)).join(', ');

    return `  ${file}: ${metrics}`;
}

const coverageSummary = require(COVERAGE_SUMMARY_PATH);
const incompleteFiles = getStagedFiles()
    .map(file => describeIncompleteFile(coverageSummary, file))
    .filter(Boolean);

if (incompleteFiles.length > 0) {
    console.error('Staged files must have 100% coverage:');
    console.error(incompleteFiles.join('\n'));
    process.exit(1);
}
