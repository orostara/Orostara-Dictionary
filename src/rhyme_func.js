var currLinkNum = 0;

function rhymeClearPage() {
  document.getElementById("notFoundOros").style.display = "none";
  document.getElementById("perfectRhymes").style.display = "none";
  document.getElementById("nearRhymes").style.display = "none";

  document.getElementById("1SyllPerf").innerHTML = "";
  document.getElementById("2SyllPerf").innerHTML = "";
  document.getElementById("3SyllPerf").innerHTML = "";
  document.getElementById("4SyllPerf").innerHTML = "";
  document.getElementById("1SyllNear").innerHTML = "";
  document.getElementById("2SyllNear").innerHTML = "";
  document.getElementById("3SyllNear").innerHTML = "";
  document.getElementById("4SyllNear").innerHTML = "";
  currLinkNum = 0;
}

function displayRhymeEntryArry(entry, searchedTerm) {
  var perfMatches = entry[0][1];
  var perfMatchKeys = entry[0][2];
  var nearMatches = entry[1][1];
  var nearMatchKeys = entry[1][2];
  var searchedSyllNum = getSyllables(searchedTerm).length;
  var templateDef = document.getElementById("wordDef");

  for (var i = 0; i < perfMatchKeys.length; i++) {
    processMatchArray(perfMatches[perfMatchKeys[i]], templateDef, true);
  }

  for (var i = 0; i < nearMatchKeys.length; i++) {
    processMatchArray(nearMatches[nearMatchKeys[i]], templateDef, false);
  }

  cleanDisplay();
  if (!entry[0][0]) {
    document.getElementById("perfectRhymes").style.display = "none";
  } else {
    document.getElementById("perfectRhymes").style.display = "flex";
  }
  if (!entry[1][0]) {
    document.getElementById("nearRhymes").style.display = "none";
  } else {
    document.getElementById("nearRhymes").style.display = "flex";
  }
}

function processMatchArray(matchArr, tempDef, perf) {
  var newDef;
  var syllContain;
  for (var i = 0; i < matchArr.length; i++) {
    var word = matchArr[i].Orostara;
    var numSyll = getSyllables(word);
    var id;
    if (perf) {
      //covers edge case of more than 4 syllables
      if (numSyll.length < 4) {
        id = numSyll.length + "SyllPerf";
      } else {
        id = "4SyllPerf";
      }
    } else {
      //covers edge case of more than 4 syllables
      if (numSyll.length < 4) {
        id = numSyll.length + "SyllNear";
      } else {
        id = "4SyllNear";
      }
    }

    syllContain = document.getElementById(id);
    newDef = tempDef.cloneNode(true);
    newDef.id = word;
    displayEntry(matchArr[i], "findingRhyme", false, newDef);
    syllContain.appendChild(createLine());
    syllContain.appendChild(newDef);
  }
}

function cleanDisplay() {
  if (document.getElementById("1SyllPerf").innerHTML == "") {
    document.getElementById("1SyllPerfCon").style.display = "none";
  } else {
    document.getElementById("1SyllPerfCon").style.display = "flex";
  }
  if (document.getElementById("2SyllPerf").innerHTML == "") {
    document.getElementById("2SyllPerfCon").style.display = "none";
  } else {
    document.getElementById("2SyllPerfCon").style.display = "flex";
  }
  if (document.getElementById("3SyllPerf").innerHTML == "") {
    document.getElementById("3SyllPerfCon").style.display = "none";
  } else {
    document.getElementById("3SyllPerfCon").style.display = "flex";
  }
  if (document.getElementById("4SyllPerf").innerHTML == "") {
    document.getElementById("4SyllPerfCon").style.display = "none";
  } else {
    document.getElementById("4SyllPerfCon").style.display = "flex";
  }

  if (document.getElementById("1SyllNear").innerHTML == "") {
    document.getElementById("1SyllNearCon").style.display = "none";
  } else {
    document.getElementById("1SyllNearCon").style.display = "flex";
  }
  if (document.getElementById("2SyllNear").innerHTML == "") {
    document.getElementById("2SyllNearCon").style.display = "none";
  } else {
    document.getElementById("2SyllNearCon").style.display = "flex";
  }
  if (document.getElementById("3SyllNear").innerHTML == "") {
    document.getElementById("3SyllNearCon").style.display = "none";
  } else {
    document.getElementById("3SyllNearCon").style.display = "flex";
  }
  if (document.getElementById("4SyllNear").innerHTML == "") {
    document.getElementById("4SyllNearCon").style.display = "none";
  } else {
    document.getElementById("4SyllNearCon").style.display = "flex";
  }
}

function createLine() {
  var el = document.createElement("hr");
  el.id = "line";
  el.className = "line";

  return el;
}

//used in dict_process_oros_word.js
function rhymeOros(word1) {
  if (word1.length < 2) {
    console.log("Word Not Long Enough");
    return [];
  }
  if (!isOrosCompatible(word1)) {
    console.log("Word Not Orostara Compatible");
    return [];
  }

  var perfmatches = {}; //makes bin by number of syllables
  var perfmatchKeys = []; //keeps track of which bins there are for iterating later
  var perfmatchesFound = false;
  var nearmatches = {}; //makes bin by number of syllables
  var nearmatchKeys = []; //keeps track of which bins there are for iterating later
  var nearmatchesFound = false;
  var word = word1.toLowerCase();

  // go through whole dict
  for (var i = 0; i < orosDict.length; i++) {
    var checkWord = orosDict[i].Orostara.toLowerCase();

    //skip the word in the dict that's the word we're rhyming
    if (checkWord == word) {
      continue;
    }

    var rhymeWordSyll = getSyllables(word);
    var dictWordSyll = getSyllables(checkWord);

    //not a match; go to next word
    if (dictWordSyll.length < rhymeWordSyll.length) {
      var isMatch = isRhyme(rhymeWordSyll, dictWordSyll);

      if (isMatch) {
        nearmatchesFound = true;
        var syllNum = rhymeWordSyll.length;
        if (nearmatches.hasOwnProperty(syllNum)) {
          nearmatches[syllNum].push(orosDict[i]);
        } else {
          nearmatches[syllNum] = [orosDict[i]];
          nearmatchKeys.push(syllNum);
        }
      }
    } else {
      var isMatch = isRhyme(dictWordSyll, rhymeWordSyll);

      if (isMatch) {
        perfmatchesFound = true;
        var syllNum = rhymeWordSyll.length;
        if (perfmatches.hasOwnProperty(syllNum)) {
          perfmatches[syllNum].push(orosDict[i]);
        } else {
          perfmatches[syllNum] = [orosDict[i]];
          perfmatchKeys.push(syllNum);
        }
      }
    }
  }
  if (!perfmatchesFound && !nearmatchesFound) {
    console.log("No Matches Found");
    return [];
  }
  return [
    [perfmatchesFound, perfmatches, perfmatchKeys],
    [nearmatchesFound, nearmatches, nearmatchKeys],
  ];
}

//longer and shorter are ARRAYS of SYLLABLES
function isRhyme(longer, shorter) {
  var isMatch = true;
  var dWordLen = longer.length - 1;
  for (var j = shorter.length - 1; j > 0; j--) {
    if (longer[dWordLen] != shorter[j]) {
      isMatch = false;
      break;
    }
    dWordLen--;
  }

  return isMatch && isRhymeOneSyll(longer[dWordLen], shorter[0]);
}

//CAN ONLY HANDLE ONE SYLLABLE
function isRhymeOneSyll(word1, word2) {
  // syllable options are cvc, vc, v, cv
  var vowels = ["a", "e", "o", "i", "u"];
  var rhym1 = word1;
  var rhym2 = word2;

  //then first letter of word 1 is consonant. Chop it off
  if (!vowels.includes(word1.charAt(0))) {
    rhym1 = word1.substring(1);
  }

  if (!vowels.includes(word2.charAt(0))) {
    rhym2 = word2.substring(1);
  }

  return rhym1 == rhym2;
}

//returns array of syllables. example, given panana, it would return ['pa','na','na']
//MUST BE OROSTARA COMPATIBLE WORD
function getSyllables(word) {
  // syllable options are cvc, vc, v, cv
  var vowels = ["a", "e", "o", "i", "u"];

  if (word.length == 0) {
    return [];
  } else if (word.length == 1) {
    //v
    return [word];
  } else if (word.length == 2) {
    //cv, vc, or vv (need to weed out vv)
    if (vowels.includes(word.charAt(0))) {
      //vc or vv
      if (!vowels.includes(word.charAt(1))) {
        //vc
        return [word];
      }
    } else {
      //vc
      return [word];
    }
  }

  //length is at least 2 (3 if not vv)
  var sylls = [];
  if (vowels.includes(word.charAt(word.length - 1))) {
    // if last character is vowel
    if (vowels.includes(word.charAt(word.length - 2))) {
      //last 2 vv
      var front = word.substring(0, word.length - 1);
      sylls = getSyllables(front);
      sylls.push(word.charAt(word.length - 1));
      return sylls;
    } else {
      //last 2 cv
      var front = word.substring(0, word.length - 2);
      sylls = getSyllables(front);
      sylls.push(word.substring(word.length - 2));
      return sylls;
    }
  } else {
    //last character is consonant AND at least 3 characters
    if (vowels.includes(word.charAt(word.length - 3))) {
      //last 3 vvc
      var front = word.substring(0, word.length - 2);
      sylls = getSyllables(front);
      sylls.push(word.substring(word.length - 2));
      return sylls;
    } else {
      //last 3 cvc
      if (word.length == 3) {
        return [word];
      } else {
        // at least 4 characters
        if (vowels.includes(word.charAt(word.length - 4))) {
          //last 4 vcvc
          var front = word.substring(0, word.length - 2);
          sylls = getSyllables(front);
          sylls.push(word.substring(word.length - 2));
          return sylls;
        } else {
          //last 4 ccvc
          var front = word.substring(0, word.length - 3);
          sylls = getSyllables(front);
          sylls.push(word.substring(word.length - 3));
          return sylls;
        }
      }
    }
  }
}

function isOrosCompatible(word) {
  return inOrosAlphabet(word) && obeysConsonantRules(word);
}

function obeysConsonantRules(word) {
  var vowels = ["a", "e", "o", "i", "u"];
  var nonconInRow = 0;
  for (var i = 0; i < word.length; i++) {
    if (!vowels.includes(word.charAt(i))) {
      //is consonant
      nonconInRow++;
    } else {
      nonconInRow = 0;
    }
    if (nonconInRow > 2) {
      //more than 2 consonants in a row
      console.log("Word Contains More Than 2 Consonants in a Row");
      return false;
    }
  }

  if (
    word.length > 1 &&
    !vowels.includes(word.charAt(0)) &&
    !vowels.includes(word.charAt(1))
  ) {
    //first 2 char are consonants
    console.log("Word Starts With 2 Consonants");
    return false;
  }
  return true;
}

function inOrosAlphabet(word) {
  var alphabet = [
    "a",
    "e",
    "o",
    "i",
    "u",
    "m",
    "n",
    "p",
    "t",
    "k",
    "x",
    "s",
    "h",
    "r",
    "y",
  ];
  for (var i = 0; i < word.length; i++) {
    if (!alphabet.includes(word.charAt(i))) {
      console.log("Not of Orostara Alphabet");
      return false;
    }
  }
  return true;
}
