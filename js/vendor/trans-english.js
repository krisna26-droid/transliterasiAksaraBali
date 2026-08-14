(function (root) {

  var LETTER_MAP = {
    a: "a", b: "b", c: "k", d: "d", e: "e",
    f: "p", g: "g", h: "h", i: "i", j: "j",
    k: "k", l: "l", m: "m", n: "n", o: "o",
    p: "p", q: "k", r: "r", s: "s", t: "t",
    u: "u", v: "p", w: "w", x: "ks", y: "i", z: "s"
  };

  var DIGRAPH_MAP = {
    sh: "s", ch: "ch", th: "t", ph: "p", ng: "ng",
    ny: "ny", kh: "k", rt: "t", ai: "e", au: "o",
    ei: "e", ou: "u", st: "s", ll: "l", rr: "r",
    ss: "s", tt: "t", ue: "we",
    fl: "pl",   
    ag: "eg", un: "an", ea: "e", ld: "l", od: "ad",
    ub: "ab", oo: "u", ur: "er",
    al: "el"    
  };

  var TRIGRAM_MAP = {
    ife: "aip", ion: "yon", ppy: "pi",
    oll: "al", eye: "ai", sur: "syur", the: "de",
    ake: "eik",
    tch: "ch",  
    sec: "sik", sol: "sel", ute: "ut",
    app: "ep",  
    old: "ould" 
  };

  var FOURGRAM_MAP = {
    ough: "of", tion: "syen", ance: "ens", sion: "syen", colo: "kale",
    oost: "ust" 
  };

  function wordToSimplePhonetic(word) {
    var w = word.toLowerCase();
    var result = "";
    var i = 0;

    while (i < w.length) {
      var four = w.substring(i, i + 4);
      if (FOURGRAM_MAP[four]) { result += FOURGRAM_MAP[four]; i += 4; continue; }

      var three = w.substring(i, i + 3);
      if (TRIGRAM_MAP[three]) { result += TRIGRAM_MAP[three]; i += 3; continue; }

      var two = w.substring(i, i + 2);
      if (DIGRAPH_MAP[two]) { result += DIGRAPH_MAP[two]; i += 2; continue; }

      var one = w[i];
      if (LETTER_MAP[one]) { result += LETTER_MAP[one]; } else { result += one; }
      i++;
    }
    return result;
  }

  function EnglishToLatinSimple(text) {
    if (!text) return "";
    var tokens = text.match(/[a-zA-Z']+|[^a-zA-Z']+/g) || [];
    return tokens.map(function (token) {
      if (/[a-zA-Z]/.test(token)) return wordToSimplePhonetic(token);
      return token;
    }).join("");
  }

  root.EnglishToLatin = EnglishToLatinSimple;
  root.wordToSimplePhonetic = wordToSimplePhonetic;

})(typeof window !== 'undefined' ? window : this);