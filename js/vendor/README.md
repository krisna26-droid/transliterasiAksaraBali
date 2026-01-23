# Local dependencies for transliteration

This folder should hold the two dependencies that the page now loads from disk before falling back to the CDN.

1. `jquery-1.7.2.min.js`
   * Download from https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js and save it here.
2. `trans-bali.js`
   * Download from https://jv.wikipedia.org/w/index.php?title=Panganggo:Bennylin/trans-bali.js&action=raw&ctype=text/javascript and save it here.

Once these files are present, the app loads them locally; if either file is missing the page automatically falls back to the original CDN URL.
