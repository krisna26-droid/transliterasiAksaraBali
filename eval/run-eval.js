#!/usr/bin/env node
/**
 * EKARA evaluation harness
 * ---------------------------------------------------------------
 * Runs a CSV word list through the ACTUAL EKARA pipeline
 * (lib/trans-english2.js -> lib/trans-bali.js, copied verbatim
 * from the app) and reports:
 *
 *   - the EKARA phonetic string        (EnglishToLatin)
 *   - the EKARA Aksara Bali output     (DoTransliterate)
 *   - the baseline Aksara Bali output  (DoTransliterate on the
 *     raw English word, i.e. no phonetic preprocessing -- this
 *     is what the unmodified Nulisa Aksara Bali engine, and any
 *     other letter-by-letter tool, would produce)
 *   - a pass/fail flag, IF the CSV provides an expected_phonetic
 *     column to check against
 *
 * Because this loads your real source files instead of
 * reimplementing the rules, the report can never silently drift
 * from what the live app actually does.
 *
 * Usage:
 *   node run-eval.js data/design-set.csv
 *   node run-eval.js data/held-out-candidates.csv
 *
 * Output:
 *   Prints a table to the console and writes a full CSV report
 *   to output/<input-filename>-results.csv
 * ---------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadEngine() {
  const sandbox = {
    document: {
      getElementsByName(name) {
        if (name === 'spasi') {
          return [{ checked: true, value: 'with' }];
        }
        return [];
      }
    },
    console
  };
  vm.createContext(sandbox);

  const baliCode = fs.readFileSync(path.join(__dirname, 'lib/trans-bali.js'), 'utf8');
  vm.runInContext(baliCode, sandbox);

  const engCode = fs.readFileSync(path.join(__dirname, 'lib/trans-english2.js'), 'utf8');
  vm.runInContext(engCode, sandbox);

  return {
    EnglishToLatin: (text) => vm.runInContext(`EnglishToLatin(${JSON.stringify(text)})`, sandbox),
    DoTransliterate: (text) => vm.runInContext(`DoTransliterate(${JSON.stringify(text)})`, sandbox),
  };
}

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(',').map(c => c.trim());
    const row = {};
    header.forEach((h, i) => { row[h] = cells[i] || ''; });
    return row;
  });
}

function writeCsv(filePath, rows, columns) {
  const header = columns.join(',');
  const body = rows.map(r => columns.map(c => `"${(r[c] ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, header + '\n' + body + '\n', 'utf8');
}

function main() {
  const inputArg = process.argv[2];
  if (!inputArg) {
    console.error('Usage: node run-eval.js <path-to-word-list.csv>');
    process.exit(1);
  }
  const inputPath = path.resolve(inputArg);
  const rows = readCsv(inputPath);
  const engine = loadEngine();

  const results = rows.map(row => {
    const word = row.word;
    const expectedPhonetic = row.expected_phonetic || '';
    const note = row.note || '';

    const ekaraPhonetic = engine.EnglishToLatin(word);
    const ekaraAksara = engine.DoTransliterate(ekaraPhonetic);
    const baselineAksara = engine.DoTransliterate(word);

    let status = 'n/a (no expected value given)';
    if (expectedPhonetic) {
      status = ekaraPhonetic === expectedPhonetic ? 'MATCH' : 'MISMATCH';
    }

    return {
      word,
      expected_phonetic: expectedPhonetic,
      ekara_phonetic: ekaraPhonetic,
      status,
      ekara_aksara: ekaraAksara,
      baseline_aksara: baselineAksara,
      note,
    };
  });

  const withExpected = results.filter(r => r.expected_phonetic);
  console.log(`\nEKARA evaluation: ${inputArg}`);
  console.log('='.repeat(72));
  results.forEach(r => {
    const flag = r.status === 'MISMATCH' ? '  <-- CHECK THIS' : '';
    console.log(
      `${r.word.padEnd(14)} phonetic="${r.ekara_phonetic}"${r.expected_phonetic ? ` (expected "${r.expected_phonetic}")` : ''} ${r.status}${flag}`
    );
  });
  console.log('='.repeat(72));
  if (withExpected.length) {
    const matches = withExpected.filter(r => r.status === 'MATCH').length;
    console.log(`${matches} / ${withExpected.length} phonetic strings matched expected values.`);
  } else {
    console.log(`${results.length} words processed (no expected values supplied, so nothing to score yet -- this list is meant for expert review).`);
  }

  if (!fs.existsSync(path.join(__dirname, 'output'))) {
    fs.mkdirSync(path.join(__dirname, 'output'));
  }
  const outName = path.basename(inputArg, '.csv') + '-results.csv';
  const outPath = path.join(__dirname, 'output', outName);
  writeCsv(outPath, results, [
    'word', 'expected_phonetic', 'ekara_phonetic', 'status', 'ekara_aksara', 'baseline_aksara', 'note'
  ]);
  console.log(`\nFull report (incl. Aksara Bali Unicode + baseline output) written to:\n  ${path.relative(process.cwd(), outPath)}\n`);
}

main();
