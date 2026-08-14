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
    ub: "ab", oo: "u",
    ur: "êr",  
    oa: "o"
  };

  var TRIGRAM_MAP = {
    ife: "aip",
    ion: "yon", ppy: "pi",
    oll: "al", eye: "ai", sur: "syur", the: "de",
    ake: "eik",
    tch: "ch",
    sec: "sik", sol: "sêl",
    ute: "ut",
    app: "ep",
    old: "ould",
    the: "dê"
  };

  var FOURGRAM_MAP = {
    ough: "op",
    tion: "syên",
    ance: "ens",
    sion: "syên",
    colo: "kalê",
    oost: "ust"
  };

  function wordToSimplePhonetic(word) {
    var w = word.toLowerCase();
    var result = "";
    var i = 0;

    while (i < w.length) {
      var four = w.substring(i, i + 4);

      if (FOURGRAM_MAP[four]) {
        // Kasus khusus DI DALAM tingkat FOURGRAM (bukan tingkat baru):
        // "tion"/"sion" yang langsung diikuti "al" itu satu morfem utuh
        // (-tional / -sional), selalu pepet di keduanya -> "syênêl".
        if ((four === "tion" || four === "sion") &&
            w.substring(i + 4, i + 6) === "al") {
          result += FOURGRAM_MAP[four] + "êl";
          i += 6;
          continue;
        }
        result += FOURGRAM_MAP[four];
        i += 4;
        continue;
      }

      var three = w.substring(i, i + 3);
      if (TRIGRAM_MAP[three]) { result += TRIGRAM_MAP[three]; i += 3; continue; }

      var two = w.substring(i, i + 2);
      if (DIGRAPH_MAP[two]) { result += DIGRAPH_MAP[two]; i += 2; continue; }

      var one = w[i];
      if (one === "y" && "aeiou".indexOf(w[i + 1]) !== -1) {
        // "y" diikuti huruf vokal -> "y" berfungsi sebagai semivokal/konsonan
        // (yard, yes, royal, beyond) -> pertahankan sebagai "y", jangan jadi "i"
        result += "y";
      } else if (LETTER_MAP[one]) {
        // "y" TIDAK diikuti vokal -> "y" berfungsi sebagai vokal /i/
        // (system, myth, gym) -> tetap dipetakan ke "i" seperti semula
        result += LETTER_MAP[one];
      } else {
        result += one;
      }
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