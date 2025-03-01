/* jshint esversion: 8 */
var endList = ["a", "e", "o", "i", "u"];
var specialCases = [
  "ni",
  "mi", "me","ke",
  "ki",
  "ha",
  "na",
  "o",
  "ma",
  "ko",
  "tu",
  "axa",
  "anti",
  "xu",
  "haha",
  "hihi",
];

function orosClick(searchedWord) {
  if (currPage == "translator") {
    clearPage();
  } else if (currPage == "rhymes") {
    rhymeClearPage();
  } else {
    console.log("invalid currPage in orosClick(): " + currPage);
  }
  var lastChar = searchedWord.charAt(searchedWord.length - 1);

  //not a special case and DOES end in a vowel
  if (
    specialCases.indexOf(searchedWord) == -1 &&
    endList.indexOf(lastChar) != -1
  ) {
    //chop off last letter (vowel)
    searchedWord = searchedWord.substring(0, searchedWord.length - 1);
  }

  var found = orosEntry(searchedWord);
  if (found == 1) {
    incMemory("Orostara", searchedWord);
  }
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
      displayRhymeEntryArry(
        entry1[1],
        entry1[2],
        searchedWord,
        getSyllables(searchedWord).length,
      );
      return 1;
    }
  } else {
    console.log("invalid currPage in orosEntry: " + currPage);
  }
}

function searchOros(word1) {
  var entryArr = [];
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
        entryArr.push(orosDict[i]);
        break; //just out of this inner for loop
      }
    }
  }
  return entryArr;
}

function pushArray(base, add) {
  var newArr = base;
  for (var i = 0; i < add.length; i++) {
    newArr.push(add[i]);
  }
  return newArr;
}
