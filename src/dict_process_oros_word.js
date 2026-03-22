/* jshint esversion: 8 */
var endList = ["a", "e", "o", "i", "u"];
var specialCases = [
  "ni",
  "mi",
  "me",
  "ke",
  "ki",
  "ha",
  "na",
  "o",
  "yo",
  "ma",
  "ko",
  "tu",
  "axa",
  "xu",
  "haha",
  "hihi",
  "a",
];

function orosClick(searchedWord) {
  if (currPage == "translator") {
    clearPage();
  } else if (currPage == "rhymes") {
    rhymeClearPage();
  } else {
    console.log("invalid currPage in orosClick(): " + currPage);
  }
  var word = deEndifyOrosWord(searchedWord)[0];
  var found = orosEntry(word, searchedWord);
  if (found == 1) {
    incMemory("Orostara", word);
  }
}

// return length can be 1 or 2
// first entry is always word (minus ending if applicable)
// second entry is word w no modifications if its a special case
function deEndifyOrosWord(word) {
  var lastChar = word.charAt(word.length - 1);
  var toReturn = [word];
  //not a special case and DOES end in a vowel
  if (endList.indexOf(lastChar) != -1) {
    //chop off last letter (vowel)
    toReturn = [word.substring(0, word.length - 1)];
  }
  if (specialCases.indexOf(word) != -1 && word != toReturn[0]) {
    toReturn.push(word);
  }
  return toReturn;
}

function orosEntry(word, searchedWord) {
  var entry1;
  if (currPage == "translator") {
    entry1 = searchOros(word);
    if (specialCases.indexOf(searchedWord) != -1) {
      var special = searchOros(searchedWord);
      var temp = special.concat(entry1);
      entry1 = temp;
    }
    if (entry1.length == 0) {
      document.getElementById("notFoundOros").style.display = "flex";
      return 0;
    } else {
      displayEntryArry(entry1, word);
      if (entry1.length != 0) {
        return 1;
      } else {
        return 2;
      }
    }
  } else if (currPage == "rhymes") {
    entry1 = rhymeOros(word);
    if (entry1.length == 0) {
      document.getElementById("notFoundOros").style.display = "flex";
      return 0;
    } else {
      displayRhymeEntryArry(entry1, word);
      return 1;
    }
  } else {
    console.log("invalid currPage in orosEntry: " + currPage);
  }
}

function searchOros(word1) {
  var basicEntryArr = [];
  var otherEntryArr = [];
  var word = word1.toLowerCase();
  //check every word in case there's more than one (rare but not unheardof)
  for (var i = 0; i < orosDict.length; i++) {
    var options = [orosDict[i].Orostara];
    if (orosDict[i].AltSpellings != "") {
      if (!Array.isArray(orosDict[i].AltSpellings)) {
        // only one entry
        options.push(orosDict[i].AltSpellings);
      } else {
        options = options.concat(orosDict[i].AltSpellings);
      }
    }
    for (var j = 0; j < options.length; j++) {
      if (options[j].toLowerCase() == word) {
        // console.log(options);
        // console.log(orosDict[i].Type);
        if (orosDict[i].Type.includes("basic")) {
          basicEntryArr.push(orosDict[i]);
        } else {
          otherEntryArr.push(orosDict[i]);
        }
        break; //just out of this inner for loop
      }
    }
  }
  return basicEntryArr.concat(otherEntryArr);
}

function pushArray(base, add) {
  var newArr = base;
  for (var i = 0; i < add.length; i++) {
    newArr.push(add[i]);
  }
  return newArr;
}
