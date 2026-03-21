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
  var word = deEndifyOrosWord(searchedWord);
  var found = orosEntry(word);
  if (found == 1) {
    incMemory("Orostara", word);
  }
}

function deEndifyOrosWord(word) {
  var lastChar = word.charAt(word.length - 1);
  var toReturn = word;
  //not a special case and DOES end in a vowel
  if (specialCases.indexOf(word) == -1 && endList.indexOf(lastChar) != -1) {
    //chop off last letter (vowel)
    toReturn = word.substring(0, word.length - 1);
  }
  return toReturn;
}

function orosEntry(searchedWord) {
  var entry1;
  if (currPage == "translator") {
    entry1 = searchOros(searchedWord);
    if (entry1.length == 0) {
      document.getElementById("notFoundOros").style.display = "flex";
      return 0;
    } else {
      displayEntryArry(entry1, searchedWord);
      if (entry1.length != 0) {
        return 1;
      } else {
        return 2;
      }
    }
  } else if (currPage == "rhymes") {
    entry1 = rhymeOros(searchedWord);
    if (entry1.length == 0) {
      document.getElementById("notFoundOros").style.display = "flex";
      return 0;
    } else {
      displayRhymeEntryArry(entry1, searchedWord);
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
  //TODO: come back and make a proper patch to double search all the special cases
  if (word == "yo") {
    for (var i = 0; i < orosDict.length; i++) {
      if (orosDict[i].Orostara == "y") {
        basicEntryArr.push(orosDict[i]);
        break;
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
