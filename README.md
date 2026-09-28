## EKARA: English-to-Aksara Bali Transliteration via Longest-Match-First Phonetic Substitution

This fork adds **EKARA**, a phonetic preprocessing module for English loanwords
(e.g. business and tourism signage vocabulary), described in the paper
*"EKARA: English-to-Aksara Bali Transliteration via Longest-Match-First
Phonetic Substitution."* English input is converted to an approximate
phonetic form (`js/vendor/trans-english2.js`) before being passed, unmodified,
to the original Nulisa Aksara Bali transliteration engine
(`js/vendor/trans-bali.js`).

Try it: open `index.html` and select the "Teks Inggris -> Aksara Bali"
(English mode) radio button.

## Reproducing the paper's results

See [`eval/README.md`](eval/README.md) for a small Node harness that runs the
actual engine files in this repository against the paper's 26-word evaluation
set and a held-out candidate word list.

## License and attribution

The EKARA-specific additions in this repository (`js/vendor/trans-english.js`,
`js/vendor/trans-english2.js`, and the `eval/` directory) are original
contributions released under the MIT License (see `LICENSE`).

The base transliteration engine (`js/vendor/trans-bali.js`) and the original
application shell are forked from Bennylin's transliterasi / transliterasijawa
project (https://github.com/bennylin/transliterasi), used and extended here
with attribution per the original project's own practice. The upstream
project does not state a license as of this writing.
