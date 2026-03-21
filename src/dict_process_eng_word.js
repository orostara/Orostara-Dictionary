/* jshint esversion: 8 */

function engClick(searchedWord) {
  clearPage();
  var found = engEntry(searchedWord);
  if (found) {
    incMemory("English", searchedWord);
  }
}

function engEntry(searchedWord) {
  if (searchedWord.length == 0) {
    document.getElementById("notFoundEng").style.display = "flex";
    return false;
  }
  var entryArr = searchEnglish(searchedWord);
  if (entryArr.length == 0) {
    document.getElementById("notFoundEng").style.display = "flex";
    return false;
  } else {
    displayEntryArry(entryArr, searchedWord);
    return true;
  }
}

function searchEnglish(word) {
  var perfBasicArr = [];
  var perfAddArr = [];
  var nearBasicArr = [];
  var nearAddArr = [];

  var entryArr = [];

  //go through every dictionary entry

  for (var i = 0; i < orosDict.length; i++) {
    var entriesToCheck = [
      orosDict[i].Nouns,
      orosDict[i].Verbs,
      orosDict[i].Adjectives,
      orosDict[i].Adverbs,
      orosDict[i].Other,
    ];

    var perfectIndex = -1; //position of first PERFECT match in an array for ordering
    var nearIndex = -1; //position of first PARTIAL match in a array for ordering
    for (var j = 0; j < entriesToCheck.length; j++) {
      //check ALL of the entries, even if found, in case there is a perfect match so that can be displayed first
      //search each entry option

      var array = entriesToCheck[j];
      if (!Array.isArray(array)) {
        if (array == "") {
          //skip if entry is empty
          continue;
        }
        //make an array if only one entry
        array = [entriesToCheck[j]];
      }
      var result = arrayHasWord(array, word);
      //result[2] CANNOT be -1 if result[0] is true

      if (result[0] && result[1]) {
        if (perfectIndex == -1 || perfectIndex > result[2]) {
          perfectIndex = result[2];
        }
      } else if (result[0]) {
        if (nearIndex == -1 || nearIndex > result[2]) {
          nearIndex = result[2];
        }
      }
    }

    if (nearIndex != -1 || perfectIndex != -1) {
      //match of some kind found
      if (orosDict[i].Type.includes("basic")) {
        if (perfectIndex != -1) {
          pushInOrder(perfBasicArr, [orosDict[i], perfectIndex]);
        } else {
          pushInOrder(nearBasicArr, [orosDict[i], nearIndex]);
        }
      } else {
        if (perfectIndex != -1) {
          pushInOrder(perfAddArr, [orosDict[i], perfectIndex]);
        } else {
          pushInOrder(nearAddArr, [orosDict[i], nearIndex]);
        }
      }
    }
  }
  //always show the basic words first
  entryArr = [];
  var wantedOrder = [perfBasicArr, nearBasicArr, perfAddArr, nearAddArr];
  for (var k = 0; k < wantedOrder.length; k++) {
    for (var m = 0; m < wantedOrder[k].length; m++) {
      entryArr.push(wantedOrder[k][m][0]);
    }
  }
  return entryArr;
}

function pushInOrder(arr, item) {
  if (arr.length == 0) {
    return arr.push(item);
  }
  for (var i = 0; i < arr.length; i++) {
    if (item[1] < arr[i][1]) {
      arr.splice(i, 0, item);
      return;
    }
  }
}

//Return [word is found in array, word found is single entry (not part of larger string), index found]
function arrayHasWord(arr, word1) {
  var word = word1.toLowerCase();
  //search through array
  for (var j = 0; j < arr.length; j++) {
    //cleanup
    var check = arr[j];
    if (check.charAt(0) == "(") {
      var index = 1;
      //find end of paranthetical
      while (check.charAt(index) != ")" && index < check.length) {
        index++;
      }

      var newCheck = check.substring(index + 1);

      //take away space between parathentical and word if there
      if (newCheck.charAt(0) == " " && newCheck.length > 1) {
        check = newCheck.substring(1);
      } else {
        check = newCheck;
      }
    }

    //check for a match
    if (check.toLowerCase() == word) {
      return [true, true, j];
    }

    //if array element is more than one word
    if (check.indexOf(" ") != -1) {
      //make array with both words
      var multiDef = check.split(" ");
      //recurse
      if (arrayHasWord(multiDef, word)[0]) {
        return [true, false, j]; //not a perfect match
      }
    }
  }
  return [false, false, -1]; //not found
}
