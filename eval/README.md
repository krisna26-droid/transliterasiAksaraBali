# EKARA evaluation harness

A small, dependency-free Node script for re-running EKARA's phonetic
preprocessing + transliteration pipeline against a word list, without
manually typing words into the web UI one at a time.

It loads `lib/trans-english2.js` and `lib/trans-bali.js` **verbatim**
(copied straight from `js/vendor/` in the main app), so results can
never silently drift from what the live app actually does. If you
update the rule tables in the app, re-copy the file here before
re-running.

## Why this exists

Reviewers asked for (a) evaluation on a held-out word list not used
to design the rules, and (b) reproducible evidence for the accuracy
claims. This harness makes both a one-command operation instead of a
manual, error-prone transcription exercise, which is how the
`flagship` -> `flegsip` vs `plegsip` mismatch happened in the first
submission (see below).

## Usage

```bash
node run-eval.js data/design-set.csv
node run-eval.js data/held-out-candidates.csv
```

Each run prints a console summary and writes a full CSV report to
`output/<name>-results.csv`.

## Included word lists

- `data/design-set.csv`: the 26 words from the paper's Table IV.
  Running this reproduces the paper's evaluation and flags any word
  where the manuscript and the actual code disagree.
- `data/held-out-candidates.csv`: 26 tourism-vocabulary words not
  used to author any rule, for expert review before scoring.

## Extending it

Add rows to a CSV and run the script against it. Send
`output/held-out-candidates-results.csv` to a Balinese-language
expert, they fill in what they'd consider correct, and you re-run
with `expected_phonetic` filled in to get a scored report.
