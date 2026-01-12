//TODO
//cute little encouragement every 10? in a row?
//confetti on the streak????

var activeSets = [1];
var activePrevAll = [1];
var currSet = [];
var tempSet = [];

var language = 3; //1 for Orostara, 2 for English, 3 for both
var currLang; //1 for Orostara, 2 for English

var wordEntry; //orosDict entry for current word pick
var options = []; //parts of speech available for that word
var pos; //part of speech chosen 1-5 (noun, verb, adj, adv, other)
var currWord = "";
var currAnswer = "";

var givenAns = "";

function checkForVocabDuplicates() {
  for (var i = 0; i < vocab.length - 1; i++) {
    //don't check other
    for (var j = 0; j < vocab[i].length; j++) {
      var word = vocab[i][j];
      var found = false;
      for (var k = i; k < vocab.length - 1; k++) {
        for (var m = 0; m < vocab[k].length; m++) {
          if (k != i && m != j && vocab[k][m] == word) {
            console.log("repeat found: " + word);
            found = true;
            break;
          }
        }
        if (found) {
          break;
        }
      }
    }
  }
}

function checkAllBasicPresent() {
  //check all the basic words are in vocab
  var remaining = []; // basicOnly.slice(0,basicOnly.length);
  for (var i = 0; i < basicOnly.length; i++) {
    var isInVocab = searchVocab(basicOnly[i]);
    if (!isInVocab) {
      remaining.push(basicOnly[i]);
    }
  }
  console.log("Basic Words not Present: " + formatRemaining(remaining));

  //check all vocab words are real basic words
  remaining = [];
  for (var i = 0; i < vocab.length; i++) {
    for (var j = 0; j < vocab[i].length; j++) {
      var isInBasic = searchBasic(vocab[i][j]);
      if (!isInBasic) {
        remaining.push(vocab[i][j]);
      }
    }
  }
  console.log("Vocab Not Basic: " + formatRemaining(remaining));
}

function formatRemaining(remaining) {
  var str = "";
  var ignore = ["ma", "ko", "tu", "yo"];
  for (var i = 0; i < remaining.length; i++) {
    if (!ignore.includes(remaining[i])) {
      str += "'" + remaining[i] + "', ";
    }
  }
  return str;
}

function searchBasic(word) {
  for (var i = 0; i < basicOnly.length; i++) {
    if (basicOnly[i] == word) {
      return true;
    }
  }
  return false;
}

function searchVocab(element) {
  for (var i = 0; i < vocab.length; i++) {
    for (var j = 0; j < vocab[i].length; j++) {
      if (vocab[i][j] == element) {
        return true;
      }
    }
  }
  return false;
}

//remember to turn other array into empty in vocab before running this
function calcOther() {
  var other = "";
  for (var i = 0; i < basicOnly.length; i++) {
    var found = false;
    for (var j = 0; j < vocab.length; j++) {
      for (var k = 0; k < vocab[j].length; k++) {
        if (vocab[j][k] == basicOnly[i]) {
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    if (!found) {
      var isSpecial = false;
      for (var m = 0; m < specialCases.length; m++) {
        if (basicOnly[i] == specialCases[m]) {
          isSpecial = true;
          break;
        }
      }
      //skip special case words like particles
      if (!isSpecial) {
        if (other == "") {
          other = "'" + basicOnly[i];
        } else {
          other = other + "','" + basicOnly[i];
        }
      }
    }
  }
  console.log(other + "'");
}

function evalSet(num) {
  if (num == 12) {
    // all button
    if (
      !document.getElementById("allButt").classList.contains("multiOpActive")
    ) {
      // toggling on; activate all
      toggleActive("allButt");

      activePrevAll = activeSets;
      activeSets = [];
      for (var i = 1; i < 12; i++) {
        //1-11
        activeSets.push(i);
        toggleActive("less" + i + "Butt", true);
      }
    } else {
      //toggling off; return to previous state
      toggleActive("allButt");

      activeSets = activePrevAll;
      for (var i = 1; i < 12; i++) {
        if (!activeSets.includes(i)) {
          toggleActive("less" + i + "Butt");
        }
      }
    }
  } else {
    var isThere = -1;
    for (var i = 0; i < activeSets.length; i++) {
      if (activeSets[i] == num) {
        isThere = i;
        break;
      }
    }

    if (isThere == -1) {
      //toggle on
      activeSets.push(num);
      toggleActive("less" + num + "Butt");
    } else {
      //toggle off
      //take it out
      activeSets.splice(isThere, 1);
      toggleActive("less" + num + "Butt");

      if (
        document.getElementById("allButt").classList.contains("multiOpActive")
      ) {
        toggleActive("allButt");
      }
    }

    if (activeSets.length == 0) {
      //ALWAYS default to at least lesson 1 active
      activeSets = [1];
      toggleActive("less1Butt");
    }
  }
  setSets();
}

function setSets() {
  if (activeSets.length == 11) {
    //then all set to all
    currSet = basicOnly;
    tempSet = [];
    return;
  }

  currSet = [];
  for (var i = 0; i < activeSets.length; i++) {
    currSet = currSet.concat(vocab[activeSets[i] - 1]);
  }
  tempSet = [];
}

function selectFlashLang(num) {
  switch (language) {
    case 1:
      toggleActive("orosButt");
      break;
    case 2:
      toggleActive("engButt");
      break;
    case 3:
      toggleActive("bothButt");
      break;
    default:
      break;
  }

  switch (num) {
    case 1:
      toggleActive("orosButt");
      break;
    case 2:
      toggleActive("engButt");
      break;
    case 3:
      toggleActive("bothButt");
      break;
    default:
      break;
  }

  language = num;
}

function toggleActive(id, forceActive) {
  if (forceActive) {
    //document.getElementById(id).classList.remove("multiOptionItem");
    document.getElementById(id).classList.add("multiOpActive");
  } else {
    if (document.getElementById(id).classList.contains("multiOpActive")) {
      //document.getElementById(id).classList.add("multiOptionItem");
      document.getElementById(id).classList.remove("multiOpActive");
    } else {
      //document.getElementById(id).classList.remove("multiOptionItem");
      document.getElementById(id).classList.add("multiOpActive");
    }
  }
}

function startFlash() {
  //calcOther();
  //checkForVocabDuplicates();
  //checkAllBasicPresent();
  resetElements();
  if (
    cleanupTextInput(document.getElementById("startBut").innerHTML) == "start"
  ) {
    document.getElementById("game").style.display = "flex";
    document.getElementById("startBut").innerHTML = "Restart";

    $("#flashAnswerBar").focus(function (event) {
      document.getElementById("checkBut").disabled = false;
    });
    $("#flashAnswerBar").focusout(function (event) {
      if (document.getElementById("flashAnswerBar").value == "") {
        document.getElementById("checkBut").disabled = true;
      }
    });
    $("#flashAnswerBar").keyup(function (event) {
      if (event.which == 13) {
        //if enter key
        if (document.getElementById("flashAnswerBar").value != "") {
          checkAnswer();
          document.getElementById("skipBut").focus();
        }
        //this.select();
        event.preventDefault();
      }
    });
    document.getElementById("flashAnswerBar").focus();
    document.getElementById("checkBut").disabled = false;
  }

  document.getElementById("correctCount").innerHTML = 0;
  document.getElementById("missedCount").innerHTML = 0;
  document.getElementById("skippedCount").innerHTML = 0;
  document.getElementById("streakCount").innerHTML = 0;
  document.getElementById("skippedMax").innerHTML = " • • • ";

  setSets();
  pickWord();
}

function pickWord() {
  if (currSet.length == 0) {
    currSet = tempSet;
    tempSet = [];
  } //start over when empty
  var index = Math.floor(Math.random() * currSet.length);
  var word = currSet.splice(index, 1)[0];
  tempSet.push(word);
  //remove option so no repeats

  wordEntry = searchOros(word);
  if (wordEntry.length > 1) {
    for (var i = 0; i < wordEntry.length; i++) {
      if (wordEntry[i].Type.includes("basic")) {
        wordEntry = searchOros(word)[i];
      }
    }
  } else {
    wordEntry = searchOros(word)[0];
  }

  if (wordEntry == undefined) {
    console.log("Error: wordEntry undefined");
    return;
  }

  options = [];
  if (wordEntry.Nouns != "") {
    options.push(1);
  }
  if (wordEntry.Verbs != "") {
    options.push(2);
  }
  if (wordEntry.Adjectives != "") {
    options.push(3);
  }
  if (wordEntry.Adverbs != "") {
    options.push(4);
  }
  if (wordEntry.Other != "") {
    options.push(5);
  }
  var typeIndex = Math.floor(Math.random() * options.length);
  pos = options[typeIndex];

  currLang = language;
  if (language == 3) {
    currLang = Math.floor(Math.random() * 2 + 1);
  }

  if (currLang == 1) {
    //orostara
    document.getElementById("label").innerHTML = "OROSTARA";
    switch (pos) {
      case 1:
        currWord = wordEntry.Orostara + "a";
        currAnswer = wordEntry.Nouns;
        break;
      case 2:
        currWord = wordEntry.Orostara + "o";
        currAnswer = wordEntry.Verbs;
        break;
      case 3:
        currWord = wordEntry.Orostara + "i";
        currAnswer = wordEntry.Adjectives;
        break;
      case 4:
        currWord = wordEntry.Orostara + "e";
        currAnswer = wordEntry.Adverbs;
        break;
      case 5:
        currWord = wordEntry.Orostara;
        currAnswer = wordEntry.Other;
        break;
      default:
        currWord = "Error: No Definitions Found for orostara pos " + pos;
    }
    document.getElementById("flashWord").innerHTML = currWord;
  } else {
    //english
    document.getElementById("label").innerHTML = "ENGLISH";
    switch (pos) {
      case 1:
        currAnswer = wordEntry.Orostara + "a";
        currWord = wordEntry.Nouns;
        break;
      case 2:
        currAnswer = wordEntry.Orostara + "o";
        currWord = wordEntry.Verbs;
        break;
      case 3:
        currAnswer = wordEntry.Orostara + "i";
        currWord = wordEntry.Adjectives;
        break;
      case 4:
        currAnswer = wordEntry.Orostara + "e";
        currWord = wordEntry.Adverbs;
        break;
      case 5:
        currAnswer = wordEntry.Orostara;
        currWord = wordEntry.Other;
        break;
      default:
        currWord = "Error: No Definitions Found for english pos " + pos;
    }
    document.getElementById("flashWord").innerHTML = displayWordList(
      currWord,
      "",
      true,
    );
  }
}

function skipCard() {
  feedback("skipped");
  flipCard();
}

function flipCard() {
  document.getElementById("checkBut").style.display = "none";
  document.getElementById("skipBut").innerHTML = "Next";
  document.getElementById("skipBut").onclick = nextCard;
  document.getElementById("flashAnswer").style.display = "flex";
  if (currLang == 1) {
    //answer is in english
    document.getElementById("flashAnswer").innerHTML = displayWordList(
      currAnswer,
      givenAns,
      true,
    );
  } else {
    //answer is in orostara
    document.getElementById("flashAnswer").innerHTML = currAnswer;
  }
  document.getElementById("flashAnswerBar").disabled = true;
  document.getElementById("flashAnswer").classList.add("shiftOverAnim");
}

//list is wordEntry.Nouns/Verbs/Adjectives/Etc
//tempCurrWord is currWord but DEFINITELY an array
//returns if redundant entry is found so givenAns might be right even if it isn't technically
function checkForRedundant(list, tempCurrWord) {
  var ticker = 0;
  var temp = [false, false];
  if (Array.isArray(list)) {
    //multiple things in wordEntry.whatever
    for (var j = 0; j < tempCurrWord.length; j++) {
      //ALL entries in currWord have to be in this option
      temp = arrayHasWord(list, tempCurrWord[j]);
      if (temp[0] || temp[1]) {
        ticker++;
      }
    }
    if (ticker == tempCurrWord.length) {
      //then all entries in currWord found in givenAns's list of definitions
      //ie there's redundancy and there's no way person could know. good enough
      return true;
    }
  } else {
    if (tempCurrWord.length == 1) {
      return list == tempCurrWord[0];
    }
    //if there's more than one entry in tempCurrWord then you should have enough context to know which conj it should be
    //especially since the entry you gave doesn't have enough definitons to be redundant

    // for (var j = 0; j < tempCurrWord.length; j++) {
    //   found = found || list == tempCurrWord[j];
    //   if (found) {
    //     return found;
    //   }
    // }
  }
  return false;
}

function findAnswer(list) {
  var temp;
  if (Array.isArray(list)) {
    temp = arrayHasWord(list, givenAns);
    return temp[0] || temp[1];
  } else {
    return list == givenAns;
  }
}

function checkAnswer() {
  flipCard();
  givenAns = cleanupTextInput(document.getElementById("flashAnswerBar").value);

  //rare case with English! common with Orostara
  if (givenAns == currAnswer) {
    //Completely Correct!!
    feedback("perfect");
    return;
  }

  if (currLang == 1) {
    // Orostara, answer in english
    if (Array.isArray(currAnswer)) {
      var result = arrayHasWord(currAnswer, givenAns); //already disregards paratheticals
      if (result[0] || result[1]) {
        // word is a match to an entry of correct part of speech
        feedback("perfect");
        return;
      }
    }
    //check if answer given is simply from another part of speech
    var result2 = false;
    for (var i = 0; i < options.length; i++) {
      switch (options[i]) {
        case 1:
          result2 = findAnswer(wordEntry.Nouns);
          break;
        case 2:
          result2 = findAnswer(wordEntry.Verbs);
          break;
        case 3:
          result2 = findAnswer(wordEntry.Adjectives);
          break;
        case 4:
          result2 = findAnswer(wordEntry.Adverbs);
          break;
        case 5:
          result2 = findAnswer(wordEntry.Other);
          break;
        default:
          currWord =
            "Error: No Definitions Found for " + options[i] + " in " + options;
      }
      if (result2) {
        feedback("correct");
        return;
      }
    }
    feedback("missed");

    // } else {
    //   //already know they're not a perfect match, so if not array, then not correct
    //   feedback("missed");
    // }
  } else {
    //English, answer in Orostara AND not perfect match
    var giv = givenAns;
    var ans = currAnswer;
    var endChar = "";
    if (endList.indexOf(givenAns.charAt(givenAns.length - 1)) != -1) {
      giv = givenAns.substring(0, givenAns.length - 1);
      endChar = givenAns.charAt(givenAns.length - 1);
    }
    if (endList.indexOf(currAnswer.charAt(currAnswer.length - 1)) != -1) {
      ans = currAnswer.substring(0, currAnswer.length - 1);
    }
    if (giv == ans) {
      //part of speach is wrong but word is correct

      //for when 2+ orostara words translate to same english word. Not the players fault! good enough
      var tempCurrWord = currWord;
      if (!Array.isArray(tempCurrWord)) {
        tempCurrWord = [tempCurrWord];
      }
      var found;
      switch (endChar) {
        case "a":
          found = checkForRedundant(wordEntry.Nouns, tempCurrWord);
          break;
        case "o":
          found = checkForRedundant(wordEntry.Verbs, tempCurrWord);
          break;
        case "i":
          found = checkForRedundant(wordEntry.Adjectives, tempCurrWord);
          break;
        case "e":
          found = checkForRedundant(wordEntry.Adverbs, tempCurrWord);
          break;
        case "":
          found = checkForRedundant(wordEntry.Other, tempCurrWord);
          break;
        default:
          currWord = "Error: No Definitions Found for endChar " + endChar;
          found = false;
      }
      if (found) {
        feedback("good");
        return;
      }

      feedback("correct");
    } else {
      //answer is wrong
      feedback("missed");
    }
  }
}

function feedback(type) {
  //perfect,correct, missed, skipped
  var text;
  if (type == "perfect") {
    var num = document.getElementById("correctCount").innerHTML;
    document.getElementById("correctCount").innerHTML = parseFloat(num) + 1;
    num = document.getElementById("streakCount").innerHTML;
    document.getElementById("streakCount").innerHTML = parseInt(num) + 1;
    document.getElementById("feedback").innerHTML = "PERFECT!";
    document.getElementById("feedback").style.color = "limegreen";
    document.getElementById("feedback").style.opacity = 1;
    //document.getElementById("flashAnswer").style.borderColor = "limegreen";
    document.getElementById("cardContain").style.boxShadow =
      "0px 0px 18px rgba(50, 205, 50, 1)";
    document.getElementById("cardContain").classList.add("greenGlowAnim");
    text = true;
  } else if (type == "good") {
    var num = document.getElementById("correctCount").innerHTML;
    document.getElementById("correctCount").innerHTML = parseFloat(num) + 1;
    num = document.getElementById("streakCount").innerHTML;
    document.getElementById("streakCount").innerHTML = parseInt(num) + 1;
    document.getElementById("feedback").innerHTML = "Good Enough!";
    document.getElementById("feedback").style.color = "limegreen";
    document.getElementById("feedback").style.opacity = 1;
    //document.getElementById("flashAnswer").style.borderColor = "limegreen";
    document.getElementById("cardContain").style.boxShadow =
      "0px 0px 18px rgba(50, 205, 50, 1)";
    document.getElementById("cardContain").classList.add("greenGlowAnim");
    text = true;
  } else if (type == "correct") {
    var num = document.getElementById("correctCount").innerHTML;
    document.getElementById("correctCount").innerHTML = parseFloat(num) + 0.5;
    document.getElementById("feedback").innerHTML =
      "Very Close! Partial Credit";
    document.getElementById("feedback").style.color = "limegreen";
    document.getElementById("feedback").style.opacity = 1;
    //document.getElementById("flashAnswer").style.borderColor = "limegreen";
    document.getElementById("cardContain").style.boxShadow =
      "0px 0px 18px rgba(50, 205, 50, 1)";
    document.getElementById("cardContain").classList.add("greenGlowAnim");
    text = true;
  } else if (type == "missed") {
    var num = document.getElementById("missedCount").innerHTML;
    document.getElementById("missedCount").innerHTML = parseInt(num) + 1;
    document.getElementById("streakCount").innerHTML = 0;
    document.getElementById("feedback").innerHTML = "Try Again...";
    document.getElementById("feedback").style.color = "firebrick";
    document.getElementById("feedback").style.opacity = 1;
    //document.getElementById("flashAnswer").style.borderColor = "firebrick";
    document.getElementById("cardContain").style.boxShadow =
      "0px 0px 18px rgba(178, 34, 34, 1)";
    document.getElementById("cardContain").classList.add("redGlowAnim");
    text = true;
  } else if (type == "skipped") {
    var currSkipped = parseInt(
      document.getElementById("skippedCount").innerHTML,
    );
    document.getElementById("skippedCount").innerHTML = currSkipped + 1;

    var currStreak = parseInt(document.getElementById("streakCount").innerHTML);
    if (currStreak > 0) {
      if (document.getElementById("skippedMax").innerHTML == " • • • ") {
        document.getElementById("skippedMax").innerHTML = " • •   ";
      } else if (document.getElementById("skippedMax").innerHTML == " • •   ") {
        document.getElementById("skippedMax").innerHTML = " •     ";
      } else if (document.getElementById("skippedMax").innerHTML == " •     ") {
        document.getElementById("skippedMax").innerHTML = "       ";
      } else {
        document.getElementById("skippedMax").innerHTML = " • • • ";

        document.getElementById("streakCount").innerHTML = "0";
        document.getElementById("feedback").innerHTML =
          "Streak Lost (Skip limit: 3)";
        document.getElementById("feedback").style.opacity = 1;
        text = true;
      }
    }
  } else {
    console.log("invalid feedback type");
  }

  if (text) {
    document.getElementById("feedback").classList.add("fadeOutAnim");
  }
}

function nextCard() {
  givenAns = "";

  pickWord();
  resetElements();
}

function resetElements() {
  document.getElementById("skipBut").innerHTML = "Skip";
  document.getElementById("skipBut").onclick = skipCard;
  document.getElementById("checkBut").style.display = "flex";
  document.getElementById("checkBut").disabled = true;

  document.getElementById("flashAnswerBar").value = "";
  document.getElementById("flashAnswerBar").disabled = false;
  document.getElementById("flashAnswerBar").focus();

  document.getElementById("cardContain").classList.remove("greenGlowAnim");
  document.getElementById("cardContain").classList.remove("redGlowAnim");
  document.getElementById("cardContain").style.boxShadow = "none";

  document.getElementById("flashAnswer").style.display = "none";
  document.getElementById("flashAnswer").classList.remove("shiftOverAnim");

  document.getElementById("feedback").style.opacity = 0;
  document.getElementById("feedback").innerHTML = "Skipped";
  document.getElementById("feedback").style.color = "black";
  document.getElementById("feedback").classList.remove("fadeOutAnim");
}
