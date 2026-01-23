/*!
* trans-bali.js
* https://bennylin.github.com/transliterasijawa/bali.html
*
* Copyright 2013, Bennylin @bennylin
* Dual licensed under the MIT or GPL Version 2 licenses.
* Released under the MIT, BSD, and GPL Licenses.
*
* Versions:
* 1 Juni 2016 - v 1.0
*
*
* Derived with permission from Hindi Transliteration by Markandey Singh @markandey
* http://www.purplegene.com/static/HindiTranslitration.html
*/
var vowelPrev = false;
/***************************
Function SuperTrim, findstr
trim string, menemukan karakter di dalam string
****************************/
function SuperTrim(str) {
str = str || '';
return str.replace(/^\s*|\s*$/g,'').replace(/\s+/g,' ');
}
function findstr(str,tofind){
for (var i = 0; i < str.length; i++)
if (str[i] == tofind)
return true;
return false;
}
/***************************
Function isDigit, isPunct, isVowel
cek apakah digit, tanda baca, atau huruf vokal (a, e/è/é, i, o, u, ě/ê, ô, ā/ī/ū/ō)
****************************/
function isDigit( /*char*/ a) {
var str = "0123456789";
return findstr(str,a);
}
function isPunct( /*char*/ a) {
var str = ",.><?/+=-_}{[]*&^%$#@!~`\"\\|:;()";
return findstr(str,a);
}
function isVowel( /*char*/ a) {
var str = "AaEeÈèÉéIiOoUuÊêĚěXxôāīūō";
return findstr(str,a);
}
function isLCVowel( /*char*/ a) {
var str = "aeèéiouêěxāūō";
return findstr(str,a);
}
function isConsonant( /*char*/ a) {
var str = "BCDfGHJKLMNPRSTVWYZbcdfghjklmnpqrstvwxyzḌḍṆṇṢṣṬṭŊŋÑñɲ";//QXqx are special chars, add engma & enye
return findstr(str,a);
}
/***************************
Function isSpecial, isHR, isLW
cek apakah karakter spesial (bikonsonan/cakra-pengkal/layar-cecak-wignyan/panjingan)
****************************/
function isSpecial( /*char*/ a) {
var str = "GgHhRrYy"; //untuk bikonsonan th, dh, ng (nga dan cecak), ny, -r- (cakra), -y- (pengkal)
return findstr(str,a);
}
function isHR( /*char*/ a) {
var str = "HhRrŊŋ";//untuk layar dan wignyan //1.3 dan cecak ([[:en:w:Engma]])
return findstr(str,a);
}
function isLW( /*char*/ a) {
var str = "LlWw";//untuk panjingan ("ng" dapat diikuti "g", "r"/cakra, "y"/pengkal, dan "w" atau "l"/panjingan)
return findstr(str,a);
}
function isCJ( /*char*/ a) {
var str = "CcJj";//untuk anuswara -nj- dan -nc-
return findstr(str,a);
}
/***************************
Function GetMatra
apabila huruf vokal, return matra (sandhangan swara)
****************************/
function GetMatra(str) {
var i = 0;
if (str.length < 1) {
return "᭄";
}
while (str[i] == 'h') {
i++;
if (i >= str.length) {
break;
}
}
if (i < str.length) {
str = str.substring(i);
}
var matramap1={ "ā":"ᬵ", "e":'ᬾ', "è":'ᬾ', "é":'ᬾ', "i":'ᬶ', "ī":"ᬷ", "o":'ᭀ', "u":'ᬸ', "ū":"ᬹ", "x":"ᭂ", "ě":"ᭂ", "ê":"ᭂ", "ō":"ᭃ", "ô":"",
"A":'ᬅ', "E":'ᬏ', "È":'ᬏ', "É":'ᬏ', "I":'ᬇ', "U":'ᬉ', "O":'ᬑ', "X":"ᬅᭂ", "Ě":"ᬅᭂ", "Ê":"ᬅᭂ",
"aa":'ᬵ', "ai":'ᬿ', "au":'ᭁ', "ii":'ᬷ', "uu":'ᬹ'}
var matramap2={ "ā":"ᬵ", "e":'ᭂ', "è":'ᬾ', "é":'ᬾ', "i":'ᬶ', "ī":"ᬷ", "u":'ᬸ', "ū":"ᬹ", "o":'ᭀ', "x":"ᭂ", "ě":"ᭂ", "ê":"ᭂ", "ô":"", "ō":"ᭃ",
"A":'ᬅ', "E":'ᬅᭂ', "È":'ᬏ', "É":'ᬏ', "I":'ᬇ', "U":'ᬉ', "O":'ᬑ', "X":"ᬅᭂ", "Ě":"ᬅᭂ", "Ê":"ᬅᭂ",
"aa":'ᬵ', "ai":'ᬿ', "au":'ᭁ', "ii":'ᬷ', "uu":'ᬹ'}
var matramap, mode;
var modeTranslit = document.getElementsByName("mode");
for(var rad in modeTranslit) {
if(modeTranslit[rad].checked)
mode = modeTranslit[rad].value;
}
if(mode == "kopas")
matramap = matramap2;
else //if(mode == "ketik")
matramap = matramap1;
if(matramap[str]!==undefined){
return matramap[str];
}
return "";
}
/***************************
Function GetShift
Quick TOC:
1. ends with 'h' -- th: thr, thl, thw, thy; dh: dhr, dhl, dhw, dhy; hy,hh, rh, kh, gh, ch, jh, ṭh, th: thr, thl; dh: dhr, dhl; hy,hh, rh, kh, gh, ch, jh, ṭh, ḍh, ph, bh, sh, h
2. ends with 'g' -- ng: ngr, ngy, nggr, nggl, nggw, nggy, ngg, ngng, ngl, njr, ngw; rg, hg, gg, g
3. ends with 'y' -- ny: nyr, nyl; ry, dhy, thy, y
4. ends with 'r', panjingan 'l'/'w' -- hr, rr, nggr; ll, rl, hl; rw, hw, ngw
5. ends with 'c', and 'j' -- nc: ncr, ncl; rc; nj: njr, njl; rj;
apabila huruf bikonsonan, return karakter khusus
TODO: masih case sensitive, mis "RR" masih tidak betul
****************************/
function GetShift(str) {
str = str.toLowerCase();
if (str.indexOf("th") == 0) { //suku kata diawali 'th'
if (str.indexOf("thr") == 0) { //cakra
return { "CoreSound": "ᬝ᭄ᬭ", "len": 3 };
} else if (str.indexOf("thl") == 0) { //thl
return { "CoreSound": "ᬝ᭄ᬮ", "len": 3 };
} else if (str.indexOf("thy") == 0) { //thy -- ...
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬝ", "len": 3  };
} else if (str.indexOf("thw") == 0) { //thw -- ...
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬝ᭄ᬯ", "len": 3  };
} else {
return { "CoreSound": "ᬝ", "len": 2 };
}
} else if (str.indexOf("dh") == 0) { //suku kata diawali 'dh'
if (str.indexOf("dhr") == 0) { //cakra
return { "CoreSound": "ᬟ᭄ᬭ", "len": 3 };
} else if (str.indexOf("dhl") == 0) { //dhl
return { "CoreSound": "ᬟ᭄ᬮ", "len": 3 };
} else if (str.indexOf("dhy") == 0) { //dhy -- dhyaksa
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬟ", "len": 3  };
} else if (str.indexOf("dhw") == 0) { //dhw -- dhwani
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬟ᭄ᬯ", "len": 3  };
} else {
return { "CoreSound": "ᬟ", "len": 2 };
}
} else if (str.indexOf("hy") == 0) { //hyang
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬳ", "len": 2 };
} else if (str.indexOf("hh") == 0) { //hh
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬄᬳ", "len": 2  };
} else if (str.indexOf("rh") == 0) { //rh (kata berakhiran r diikuti kata berawalan h
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬃᬳ", "len": 2  };
} else if (str.indexOf("kh") == 0) { //kh (aksara murda)
return { "CoreSound":  "ᬔ", "len": 2  };
} else if (str.indexOf("gh") == 0) { //gh (aksara murda)
return { "CoreSound":  "ᬖ", "len": 2  };
} else if (str.indexOf("ch") == 0) { //ch (aksara murda)
return { "CoreSound":  "ᬙ", "len": 2  };
} else if (str.indexOf("jh") == 0) { //jh (aksara murda)
return { "CoreSound":  "ᬛ", "len": 2  };
} else if (str.indexOf("ṭh") == 0) { //ṭh (aksara murda)
return { "CoreSound":  "ᬞ", "len": 2  };
} else if (str.indexOf("ḍh") == 0) { //ḍh (aksara murda)
return { "CoreSound":  "ᬠ", "len": 2  };
} else if (str.indexOf("ph") == 0) { //ph (aksara murda)
return { "CoreSound":  "ᬨ", "len": 2  };
} else if (str.indexOf("bh") == 0) { //bh (aksara murda)
return { "CoreSound":  "ᬪ", "len": 2  };
} else if (str.indexOf("sh") == 0) { //sh (aksara murda)
return { "CoreSound":  "ᬰ", "len": 2  };
} else if (str.indexOf("h") == 1) { //h
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬳ", "len": 2 };
} else if (str.indexOf("h") > 1) { //suku kata memiliki konsonan 'h' yang tidak di awal suku
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
//nga
if (str.indexOf("ng") == 0) { //suku kata diawali 'ng'
if (str.indexOf("ngr") == 0) { //cakra
return { "CoreSound": "ᬗ᭄ᬭ", "len": 3 };
} else if (str.indexOf("ngy") == 0) { //pengkal
return { "CoreSound": "ᬗ", "len": 3 };
} else if (str.indexOf("nggr") == 0) { //nggronjal
return { "CoreSound": "ᬗ᭄ᬕ᭄ᬭ", "len": 4 };
} else if (str.indexOf("nggl") == 0) { //nggl-
return { "CoreSound": "ᬗ᭄ᬕ᭄ᬮ", "len": 4 };
} else if (str.indexOf("nggw") == 0) { //nggw-, munggwing
return { "CoreSound": "ᬗ᭄ᬕ᭄ᬯ", "len": 4 };
} else if (str.indexOf("nggy") == 0) { //nggy-, anggyat
return { "CoreSound": "ᬗ᭄ᬕ", "len": 4 };
} else if (str.indexOf("ngg") == 0) { //ngg
return { "CoreSound": "ᬗ᭄ᬕ", "len": 3 };/*
} else if (str.indexOf("ngng") == 0) { //ngng
return { "CoreSound": "ᬗ᭄ᬗ", "len": 4 };*/
} else if (str.indexOf("ngl") == 0) { //ngl, e.g. ngluwari
return { "CoreSound": "ᬗ᭄ᬮ", "len": 3 };
} else if (str.indexOf("ngw") == 0) { //ngw, e.g. ngwiru
return { "CoreSound": "ᬗ᭄ᬯ", "len": 3 };
} else {
return { "CoreSound": "ᬂ", "len": 2 };
}
} else if (str.indexOf("rg") == 0) { //'rg', e.g. amarga
return { "CoreSound": "ᬃᬕ", "len": 2 };
} else if (str.indexOf("hg") == 0) { //'hg', e.g. dahgene
return { "CoreSound": "ᬄᬕ", "len": 2 };
} else if (str.indexOf("gg") == 0) { //'gg', e.g. root word ends with 'g' with suffix starts with vocal
return { "CoreSound": "ᬕ᭄ᬕ", "len": 2 };
} else if (str.indexOf("g") == 1) { //g
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬕ", "len": 2 };
} else if (str.indexOf("g") > 1) { //suku kata memiliki konsonan 'g' yang tidak di awal suku
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
//nya
if (str.indexOf("ny") == 0) { //suku kata diawali 'ny'
if (str.indexOf("nyr") == 0) { //cakra
return { "CoreSound": "ᬜ᭄ᬭ", "len": 3 };
} else if (str.indexOf("nyl") == 0) { //nyl, e.g. nylonong
return { "CoreSound": "ᬜ᭄ᬮ", "len": 3 };
} else {
return { "CoreSound": "ᬜ", "len": 2 };
}
} else if (str.indexOf("ry") == 0) { //'ry', e.g. Suryati, Wiryadi
return { "CoreSound": "ᬃᬬ", "len": 2 };
} else if (str.indexOf("y") == 1) { //pengkal
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "", "len": 2 };
} else if (str.indexOf("y") > 1) { //suku kata memiliki konsonan 'y' yang tidak di awal suku
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound += ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
if (str.indexOf("hr") == 0) { //hr-
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬄ᭄ᬭ", "len": 2 };
} else if (str.indexOf("rr") == 0) { //rr -- no cakra
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬃᬭ", "len": 2  };
} else if (str.indexOf("r") == 1) { //cakra
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬭ", "len": 2 };
} else if (str.indexOf("r") > 1) { //suku kata memiliki konsonan 'r' yang tidak di awal suku
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound += ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
//panjingan -l
if (str.indexOf("ll") == 0) { //ll
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬮ᭄ᬮ", "len": 2  };
} else if (str.indexOf("rl") == 0) { //rl (kata berakhiran r diikuti kata berawalan l
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬃᬮ", "len": 2  };
} else if (str.indexOf("hl") == 0) { //hl
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬄᬮ", "len": 2  };
} else if (str.indexOf("l") == 1) { //l
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬮ", "len": 2 };
} else if (str.indexOf("l") > 1) { //suku kata memiliki konsonan 'l' yang tidak di awal suku//panjingan
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
//panjingan -w
if (str.indexOf("rw") == 0) { //rw
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬃᬯ", "len": 2  };//error untuk 'rwi', 'rwab'
} else if (str.indexOf("hw") == 0) { //hw
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬄᬯ", "len": 2  }; //ᬳ᭄ᬯ
} else if (str.indexOf("w") == 1) { //w
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬯ", "len": 2 };
} else if (str.indexOf("w") > 1) { //suku kata memiliki konsonan 'w' yang tidak di awal suku//panjingan
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
if (str.indexOf("nc") == 0) { //nc
if (str.indexOf("ncr") == 0) { //ncr -- ...
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬘ᭄ᬭ", "len": 3  };
} else if (str.indexOf("ncl") == 0) { //ncl -- ...
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬘ᭄ᬮ", "len": 3  };
} else {
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬘ", "len": 2  };
}
} else if (str.indexOf("rc") == 0) { //rc -- arca
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬃᬘ", "len": 2  };
} else if (str.indexOf("c") == 1) { //c
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬘ", "len": 2 };
} else if (str.indexOf("c") > 1) {
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
if (str.indexOf("nj") == 0) { //nj
if (str.indexOf("njr") == 0) { //njr -- anjrah
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬚ᭄ᬭ", "len": 3  };
} else if (str.indexOf("njl") == 0) { //njl -- anjlog
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬚ᭄ᬮ", "len": 3  };
} else {
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᬜ᭄ᬚ", "len": 2  };
}
} else if (str.indexOf("rj") == 0) { //'rj'
return { "CoreSound": "ᬃᬚ", "len": 2 };
} else if (str.indexOf("j") == 1) { //j
return { "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "᭄ᬚ", "len": 2 };
} else if (str.indexOf("j") > 1) {
var sound = "";
var len = 0;
var index = 0;
for (index = 0; index < str.length; index++) {
var c = str[index];
if (!isVowel(c)) {
sound = sound + ResolveCharacterSound(c);
len++;
}
else {
break;
}
}
return { "CoreSound": sound, "len": len };
}
return { "CoreSound": null, "len": 1 };
}
/***************************
Function GetCoreSound, GetSpecialSound
return aksara nglegana maupun aksara istimewa (f/v/z/pangkon)
****************************/
function GetCoreSound(str) {
var consonantMap1 = {
"A":"ᬅ", //A
"B":"ᬩ", //B
"C":"ᬘ", //C
"D":"ᬤ", //D
"E":"ᬏ", //E
"F":"ᬧ᬴", //F
"G":"ᬕ", //G
"H":"ᬳ", //H
"I":"ᬇ", //I
"J":"ᬚ", //J
"K":"ᬓ", //K
"L":"ᬮ", //L
"M":"ᬫ", //M
"N":"ᬦ", //N
"O":"ᬑ", //O
"P":"ᬧ", //P
"Q":"᭄", //Q
"R":"ᬃ", //R
"S":"ᬲ", //S
"T":"ᬢ", //T
"U":"ᬉ", //U
"V":"ᬯ᬴", //V
"W":"ᬯ", //W
"X":"ᭂ", //X
"Y":"ᬬ", //Y
"Z":"ᬚ᬴", //Z
"a":"ᬳ", //a
"b":"ᬩ", //b
"c":"ᬘ", //c
"d":"ᬤ", //d
"e":"ᬳᬾ", //e
"f":"ᬧ᬴", //f
"g":"ᬕ", //g
"h":"ᬄ", //h
"i":"ᬳᬶ", //i
"j":"ᬚ", //j
"k":"ᬓ", //k
"l":"ᬮ", //l
"m":"ᬫ", //m
"n":"ᬦ", //n
"o":"ᬳᭀ", //o
"p":"ᬧ", //p
"q":"᭄", //q
"r":"ᬃ", //r
"s":"ᬲ", //s
"t":"ᬢ", //t
"u":"ᬳᬸ", //u
"v":"ᬯ᬴", //v
"w":"ᬯ", //w
"x":"ᬳᭂ", //x
"y":"ᬬ", //y
"z":"ᬚ᬴", //z
"È":"ᬏ", //È
"É":"ᬏ", //É
"Ê":"ᬅᭂ", //Ê
"Ě":"ᬅᭂ", //Ě
"è":"ᬳᬾ", //è
"é":"ᬳᬾ", //é
"ê":"ᬳᭂ", //ê
"ě":"ᬳᭂ", //ě
"ô":"ᬳ", //ô
"ñ":"-",
"ṇ":"ᬡ",
"ḍ":"ᬟ",
"ṭ":"ᬝ",
"ṣ":"ᬱ"
}
var consonantMap2 = {
"A":"ᬅ", //A
"B":"ᬪ", //B
"C":"ᬙ", //C
"D":"ᬥ", //D
"E":"ᬏ", //E
"F":"ᬨ᬴", //F
"G":"ᬖ", //G
"H":"ᬳ᬴", //H
"I":"ᬇ", //I
"J":"ᬛ", //J
"K":"ᬔ", //K
"L":"ᬮ", //L
"M":"ᬫ", //M
"N":"ᬡ", //N
"O":"ᬑ", //O
"P":"ᬨ", //P
"Q":"᭄", //Q
"R":"-", //R
"S":"ᬰ", //S
"T":"ᬣ", //T
"U":"ᬉ", //U
"V":"ᬯ᬴", //V
"W":"ᬯ", //W
"X":"ᭂ", //X
"Y":"ᬬ", //Y
"Z":"ᬚ᬴", //Z
"a":"ᬅ", //a
"b":"ᬩ", //b
"c":"ᬘ", //c
"d":"ᬤ", //d
"e":"ᬏ", //e
"f":"ᬧ᬴", //f
"g":"ᬕ", //g
"h":"ᬄ", //h
"i":"ᬳᬶ", //i
"j":"ᬚ", //j
"k":"ᬓ", //k
"l":"ᬮ", //l
"m":"ᬫ", //m
"n":"ᬦ", //n
"o":"ᬑ", //o
"p":"ᬧ", //p
"q":"᭄", //q
"r":"ᬃ", //r
"s":"ᬲ", //s
"t":"ᬢ", //t
"u":"ᬉ", //u
"v":"ᬯ᬴", //v
"w":"ᬯ", //w
"x":"ᭂ", //x
"y":"ᬬ", //y
"z":"ᬚ᬴", //z
"È":"ᬏ", //È
"É":"ᬏ", //É
"Ê":"ᬅᭂ", //Ê
"Ě":"ᬅᭂ", //Ě
"è":"ᬏ", //è
"é":"ᬏ", //é
"ê":"ᬅᭂ", //ê
"ě":"ᬅᭂ", //ě
"ṇ":"ᬡ",
"ḍ":"ᬟ",
"ṭ":"ᬝ",
"ṣ":"ᬱ"
}
var consonantMap, murda;
var modeMurda = document.getElementsByName("murda");
for(var rad in modeMurda) {
if(modeMurda[rad].checked)
murda = modeMurda[rad].value;
}
if(murda == "pakai")
consonantMap = consonantMap2;
else //if(murda == "tidak")
consonantMap = consonantMap1;
var h_shift = GetShift(str);
var core = str;
if (h_shift["CoreSound"] == null) {
if (consonantMap[str.charAt(0)]) core = consonantMap[str.charAt(0)];
return {
"CoreSound": core,
"len": 1
};
} else {
return h_shift;
}
}
function GetSpecialSound(str) {
specialsoundMap = { "f":"ᬧ᬴᭄", "v":"ᬯ᬴᭄", "z":"ᬚ᬴᭄", "ś":"ᬰ", "q":"᭄"/*pangkon*/ }
if(specialsoundMap[str]!==undefined){
return specialsoundMap[str];
}
return null;
}
/***************************
Function ResolveCharacterSound
return tanda baca, digit, vokal, maupun nglegana+pangkon
****************************/
function ResolveCharacterSound( /*char*/ c) {
var str = "" + c;
var len = 0;
if (isDigit(c)) {
return "" + ('᭝' + (c - '0'));
} else if (isHR(str[0])) {
return "" + GetCoreSound(str).CoreSound; //layar dan wignyan
} else if (isCJ(str[1])) {
return "" + GetCoreSound(str).CoreSound + "᭄"; //anuswara
} else if (isConsonant(str[0])) {
return "" + GetCoreSound(str).CoreSound + "᭄";
} else { //if (isVowel(str[0])) {
return "" + GetCoreSound(str).CoreSound;
}
/**/
}
/***************************
Function GetSound
fungsi yang mentransliterasi masing-masing suku kata
****************************/
function GetSound(str) {
var len = 0;
str = SuperTrim(str);
if (str == null || str == "") {
return "";
}
var SpecialSound = GetSpecialSound(str);
if (SpecialSound != null && str.length == 1) {
return SpecialSound;
}
if (str.length == 1) {
return ResolveCharacterSound(str[0]);
} else {
var core_sound = GetCoreSound(str);
//return "1"+core_sound.CoreSound+"2";
var matra = "";
var konsonan = "";
if (core_sound.len >= 1) {
matra = GetMatra(str.substring(core_sound.len)); //aeiou (suku, wulu, pepet, taling, taling tarung, dll.)
/*if () {
} else {
}*/
} else {
matra = ""; }
if (str.indexOf("nggr") == 0) { //nggr-
if (vowelPrev) konsonan = "ᬂᬕ᭄ᬭ";//<vowel>nggr-, e.g. panggrahita
else konsonan = "ᬗ᭄ᬕ᭄ᬭ";//<nonvowel>nggr-, i.e. nggronjal
} else if (str.indexOf("ngg") == 0) { //ngg-
if (vowelPrev) konsonan = "ᬂᬕ";//<vowel>ngg-, e.g. tunggal
else konsonan = "ᬗ᭄ᬕ";//<nonvowel>ngg-, i.e. nggambar
} else if (str.indexOf("njl") == 0) { //njl-
konsonan = "ᬜ᭄ᬚ᭄ᬮ";
} else if (str.indexOf("njr") == 0) { //njr-
konsonan = "ᬜ᭄ᬚ᭄ᬭ";
} else if (str.indexOf("ngg") == 0) { //njr-
if (vowelPrev) konsonan = "ᬂᬕ";//<vowel>ngg-, e.g. tunggal
else konsonan = "ᬗ᭄ᬕ";//<nonvowel>ngg-, i.e. nggambar
} else if (core_sound.CoreSound == "ᬦᬜ᭄ᬘ") { // -nc-
konsonan = "ᬜ᭄ᬘ";//-nyc-/*
} else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ᭄ᬮ") { // -njl-
konsonan = "ᬜ᭄ᬚ᭄ᬮ";//-njl-
} else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ") { // -njr-
konsonan = "ᬜ᭄ᬚ᭄ᬭ";//-njr-*/
} else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ") { // -nj-
konsonan = "ᬜ᭄ᬚ";//-nyj-
} else if (core_sound.CoreSound == "ᬤᬟ᭄ᬯ") { // -dhw-
konsonan = "ᬟ᭄ᬯ";//-dhw-
} else if (core_sound.CoreSound == "ᬤᬟ") { // -dhy-
konsonan = "ᬟ";//-dhy-
} else if (core_sound.CoreSound == "ᬢᬝ᭄ᬯ") { // -thw-
konsonan = "ᬝ᭄ᬯ";//-dhw-
} else if (core_sound.CoreSound == "ᬢᬝ") { // -thy-
konsonan = "ᬝ";//-dhy-
} else if (findstr(core_sound.CoreSound,'') && matra == "᭄") { // pengkal
konsonan = core_sound.CoreSound; matra = "";//-y-
} else if (findstr(core_sound.CoreSound,'') && matra == "᭄") { // cakra
konsonan = core_sound.CoreSound; matra = "᭄ᬭ";//-r-
} else if (findstr(core_sound.CoreSound,'᭄ᬭ') && matra == "ᭂ") { // cakra keret
if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
konsonan = GetCoreSound(str[0]+str[1]).CoreSound + ""; matra = "";//nyrê-, thrê-, dhrê-
} else if (str[0] == "n" && str[1] == "g") {
if (str[2] == "g") konsonan = "ᬗ᭄ᬕ"; else konsonan = "ᬗ"; matra = "";//nggrê-/ngrê-
} else { konsonan = GetCoreSound(str[0]).CoreSound + ""; matra = "";//-rê-
}
} else if (findstr(core_sound.CoreSound, 'ᬮ') && matra == "ᭂ") { // nga lelet
if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
konsonan = GetCoreSound(str[0]+str[1]).CoreSound + "᭄ᬮᭂ"; matra = "";//nylê-, thlê-, dhlê-
} else if (str[0] == "n" && str[1] == "g") {
if (str[2] == "g") konsonan = "ᬗ᭄ᬕ᭄ᬮᭂ"; else konsonan = "ᬗ᭄ᬮᭂ"; matra = "";//ngglê-/nglê-
} else if (str[0] == "l") {
konsonan = "ᬍ"; matra = "";//-lê-
} else { konsonan = GetCoreSound(str[0]).CoreSound + "᭄ᬮᭂ"; matra = "";//-lê-
}
} else if (core_sound.CoreSound == 'ᬝ᭄ᬭ' || core_sound.CoreSound == 'ᬟ᭄ᬭ' || core_sound.CoreSound == 'ᬗ᭄ᬭ' || core_sound.CoreSound == 'ᬜ᭄ᬭ') { // i.e. nyruput
konsonan = core_sound.CoreSound;
if (matra == "᭄") matra = "";
} else if (core_sound.CoreSound == "ᬮᬮ᭄ᬮ") { // -ll-
konsonan = "ᬮ᭄ᬮ";//double -l-
} else if (core_sound.CoreSound == "ᬃᬃᬭ") { // -rr-
konsonan = "ᬃᬭ";//double -r-
} else if (core_sound.CoreSound == "ᬃᬃᬳ") { // -rh-
konsonan = "ᬃᬳ";//-rh-
} else if (core_sound.CoreSound == "ᬃᬃᬮ") { // -rl-
konsonan = "ᬃᬮ";//-rl-
} else if (core_sound.CoreSound == "ᬃᬃᬯ") { // -rw-
if (vowelPrev) konsonan = "ᬃᬯ";//-rw- -- arwana
else konsonan = "ᬭ᭄ᬯ";//rw- -- rwa/rwi/rwab
} else if (core_sound.CoreSound == "ᬃᬃᬘ") { // -rc-
konsonan = "ᬃᬘ";//-rc-
} else if (core_sound.CoreSound == "ᬄᬄᬳ") { // -hh-
konsonan = "ᬄᬳ";//double -h-
} else if (core_sound.CoreSound == "ᬄᬄᬮ") { // -hl-
if (vowelPrev) konsonan = "ᬄᬮ";//-hl-
else konsonan = "ᬳ᭄ᬮ";//hlam
} else if (core_sound.CoreSound == "ᬄᬄᬯ") { // -hw-
if (vowelPrev) konsonan = "ᬄᬯ";//-hw-
else konsonan = "ᬳ᭄ᬯ";//hwab,hwan
} else if (core_sound.CoreSound == "ᬄᬳ") { // -hy-
if (vowelPrev) konsonan = "ᬄᬬ";//sembahyang
else konsonan = "ᬳ";//hyang/*
} else if (core_sound.CoreSound == "ᬄᬄ") { // hrx-
konsonan = "ᬳ᭄ᬭ";//hrx-
} else if (core_sound.CoreSound == "ᬄᬄ᭄ᬭ") { // hr-
if (matra == "ᭂ") konsonan = "ᬳ";//hr-
else konsonan = "ᬳ᭄ᬭ";//hr-
} else if (core_sound.CoreSound == "ᬄᬳ᭄ᬭ") { // hr-
if (matra == "ᭂ") konsonan = "ᬳ";//hr-
else konsonan = "ᬳ";//hr-
} else if (core_sound.CoreSound == 'ᬄ' && matra == "᭄") { // wignyan - 12 April
konsonan = "ᬳ"; //ha
} else if (core_sound.CoreSound == 'ᬄ' && matra != "᭄") { // wignyan
konsonan = "ᬳ"; //ha
} else if (core_sound.CoreSound == 'ᬃ' && matra == "ᭂ") { // pa cerek
konsonan = "ᬋ"; matra = "";//rê
} else if (core_sound.CoreSound == 'ᬃ' && matra != "᭄") { // layar
konsonan = "ᬭ"; //ra
} else if (core_sound.CoreSound == 'ᬂ' && matra != "᭄") { // cecak
konsonan = "ᬗ"; //nga
} else if (core_sound.CoreSound == 'ᬂ' && matra == "᭄") { // cecak
konsonan = "ᬂ"; matra = "";//cecak
} else {
konsonan = core_sound.CoreSound;
}
return "" + konsonan + matra;
}
}
/***************************
Function DoTransliterate
fungsi utama yang dipanggil (main function)
****************************/
function DoTransliterate(str) {
var i = 0;
var ret = "";
var pi = 0; //?offset
var vowelFlag = false, angkaFlag = false, cecakFlag=false; startVowel = false;
var angka = {"0":'᭐',"1":'᭑',"2":'᭒',"3":'᭓',"4":'᭔',"5":'᭕',"6":'᭖',"7":'᭗',"8":'᭘',"9":'᭙'}
str = SuperTrim(str);
while (i < str.length) {
if (i > 0 && isVowel(str[i]) && isVowel(str[i-1])) { //deal with words that start with multiple vocals
if ((str[i-1] == 'a' && str[i] == 'a') || (str[i-1] == 'i' && str[i] == 'i') || (str[i-1] == 'u' && str[i] == 'u') || (str[i-1] == 'a' && str[i] == 'i') || (str[i-1] == 'a' && str[i] == 'u')) {//specials
if (i == 1 || (i > 1 && !isConsonant(str[i-2]))) { //for example if starts with 'ai-'
str = str.substring(0, i)+'h'+str.substring(i, str.length);
}
//else, do nothing, look in matramap table
} else if ((str[i-1] == 'e' || str[i-1] == 'è' || str[i-1] == 'é') && (str[i] == 'a' || str[i] == 'o')) {//-y-
str = str.substring(0, i)+'y'+str.substring(i, str.length);
} else if ((str[i-1] == 'i') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é' || str[i] == 'o' || str[i] == 'u')) {//-y-
str = str.substring(0, i)+'y'+str.substring(i, str.length);
} else if ((str[i-1] == 'o') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é')) {//-w-
str = str.substring(0, i)+'w'+str.substring(i, str.length);
} else if ((str[i-1] == 'u') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é' || str[i] == 'i' || str[i] == 'o')) {//-y-
str = str.substring(0, i)+'w'+str.substring(i, str.length);
} else {
str = str.substring(0, i)+'h'+str.substring(i, str.length);
}
}
if ((isSpecial(str[i]) || isLW(str[i]) || isCJ(str[i])) && !vowelFlag) {
//i++;
} else if (isVowel(str[1]) && startVowel) {
//ret="h";
//isVowel = true;
startVowel = false;
} else if ((str[i] == 'h' && vowelFlag) || (!isVowel(str[i]) && i > 0) || (str[i] == ' ') || isPunct(str[i]) || isDigit(str[i]) || ((i - pi) > 5)) {
if (!isDigit(str[i]) && angkaFlag) { //turn off the flag
ret+="᭝​";// with zws
angkaFlag = false;
}
if (pi < i) {
if (cecakFlag && GetSound(str.substring(pi, i)) == "ᬂ") {
cecakFlag = false;
ret += "ᬗ᭄ᬗ";
} else if (!cecakFlag && GetSound(str.substring(pi, i)) == "ᬂ") {
cecakFlag = true;
ret += "ᬂ";
} else {
cecakFlag = false;
ret += GetSound(str.substring(pi, i));
}
}
if (str[i] == ' ') {
var spasi, modeSpasi;
var pakaiSpasi = document.getElementsByName("spasi");
for(var rad in pakaiSpasi) {
if(pakaiSpasi[rad].checked)
modeSpasi = pakaiSpasi[rad].value;
}
if(modeSpasi == "without") {
spasi = ''; }
else { //if(mode == "with")
spasi = '​'; // zero-width space
//spasi = ' '; }//hair space http://en.wikipedia.org/wiki/Space_(punctuation)#Spaces_in_Unicode
}
ret += spasi; }
if (isPunct(str[i])) {
if (str[i] == '.') {
ret += "᭟​"; //titik+zero-width space
pi = i + 1;
} else if (str[i] == ',') {
ret += "᭞​"; //koma+zero-width space
pi = i + 1;
} else if (str[i] == '|') {
ret += "꧋"; pi = i + 1;
} else if (str[i] == '(') {
ret += "꧌"; pi = i + 1;
} else if (str[i] == ')') {
ret += "꧍​"; pi = i + 1;// with zws
} else if (str[i] == '-') {//tanda hubung
ret += "​"; pi = i + 1;
} else if (str[i] == '?' || str[i] == '!' || str[i] == '"' || str[i] == "'") {//tanda tanya/seru/petik
ret += "​"; //zero-width space
pi = i + 1;
} else {
ret += str[i]; pi = i + 1;
}
} else if (isDigit(str[i])) {
if (!angkaFlag) ret+="᭝";
ret += angka[str[i]];
angkaFlag = true;
pi = i + 1;
} else {
pi = i; }
vowelFlag = false;
} else if (isVowel(str[i]) && str[i] != 'h') {
if (!isDigit(str[i]) && angkaFlag) { //turn off the flag
ret+="᭝​"; //with zws
angkaFlag = false;
}
vowelFlag = true;
}
if (pi > 0 && isVowel(str[pi-1])) {//<vowel>ngg
vowelPrev = true;
}
else vowelPrev = false;
i++;
} //endwhile
if (pi < i) {
ret += GetSound(str.substring(pi, i)); }
return SuperTrim(ret);
}