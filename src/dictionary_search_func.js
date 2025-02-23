/* jshint esversion: 8 */
var langGuide = {
  "Mandarin Chinese": "普通话 (pǔtōnghuà)",
  Spanish: "español",
  Hindi: "हिंदी (hindī)",
  English: "English",
  Portuguese: "português",
  Bangla: "বাংলা (baṅla)",
  Arabic: "عَرَبِيَّة (ʕarabiyya)",
  Vietnamese: "tiếng Việt",
  Farsi: "فارسی (fârsi)",
  Turkish: "Türkçe",
  Korean: "한국어 (han'gugeo)",
  Tamil: "தமிழ் (tamiḻ)",
  Cantonese: "廣東話 (gwong2 dung1 waa6-2)",
  "Wu Chinese": "吴语 (6wu-gniu6)",
  Russian: "ру́сский (rússkij)",
  Telugu: "తెలుగు (telugu)",
  Urdu: "اردو (urdū)",
  Marathi: "मराठी (marāṭhī)",
  Punjabi: "ਪੰਜਾਬੀ (pañjābī)",
  Japanese: "日本語 (nihongo)",
  German: "deutsch",
  Gujarati: "ગુજરાતી (gujrātī)",
  Javanese: "ꦗꦮ (jawa)",
  French: "français",
  Italian: "italiano",
};

var currLinkNum = 0;

function loadTranslator() {
  load2();
  updateForBackButtons();
  setupButtons();
}

//used for translator and rhyme
function setupButtons() {
  $("#searchBar").keyup(function (event) {
    if (event.which == 13) {
      //if enter key
      translateClicked();
      this.select();
      event.preventDefault();
    }
  });

  $("#searchBar").focus(function (event) {
    this.select();
  });

  if (currPage == "translator") {
    $("#langSelect").click(function (event) {
      if (this.innerHTML == "Orostara") {
        this.innerHTML = "English";
      } else {
        this.innerHTML = "Orostara";
      }
      document.getElementById("searchBar").select();
    });
  }
}

function clearPage() {
  document.getElementById("notFoundEng").style.display = "none";
  document.getElementById("notFoundOros").style.display = "none";
  document.getElementById("wordDefContainer").style.display = "none";
  document.getElementById("extraWordDefs").innerHTML = "";
  currLinkNum = 0;
}

//used in both translator and rhyme
function translateClicked() {
  var searchedWord = cleanupTextInput(
    document.getElementById("searchBar").value,
  );
  if (
    currPage == "rhymes" ||
    document.getElementById("langSelect").innerHTML == "Orostara"
  ) {
    orosClick(searchedWord);
  } else {
    engClick(searchedWord);
  }
}

function displayEntryArry(entryArr, searchedTerm) {
  displayEntry(entryArr[0], searchedTerm, true);

  if (entryArr.length != 1) {
    for (var i = 1; i < entryArr.length; i++) {
      var originDef = document.getElementById("wordDef");
      var extraContainer = document.getElementById("extraWordDefs");

      var newDef = originDef.cloneNode(true);
      displayEntry(entryArr[i], searchedTerm, false, newDef);
      extraContainer.appendChild(createLine());
      extraContainer.appendChild(newDef);
    }
  }
}

function createLine() {
  var el = document.createElement("hr");
  el.id = "line";
  el.className = "line";

  return el;
}

//'only' dictates if I'm providing an element to propogate or if you're meant to use the default.
//false if called by displayEntryArray
//true basically any other time
function displayEntry(entry, searchedTerm, only, el) {
  var wordDefEl;
  // in case there's going to be more than one definition displayed
  if (only) {
    wordDefEl = document.getElementById("wordDef");
  } else {
    wordDefEl = el;
  }
  var childEl;

  getChildElement(wordDefEl, "word").innerHTML = entry.Orostara;

  if (currPage == "translator") {
    var rootLang = entry.RootLanguage;
    if (Array.isArray(entry.RootLanguage)) {
      rootLang = entry.RootLanguage[0];
      for (var i = 1; i < entry.RootLanguage.length; i++) {
        rootLang += "/" + entry.RootLanguage[i];
      }
    }
    var displayLang = rootLang;
    if (rootLang in langGuide) {
      displayLang = langGuide[rootLang];
    }
    getChildElement(wordDefEl, "etym").innerHTML =
      "from " +
      displayRootWord(
        entry.RLWord,
        entry.RLWordPronunciation,
        entry.RootLanguage,
      ) +
      " in " +
      displayLang;
  }

  // display Notes and Other in the same section right under the word definition
  var shown = false;
  var onCount = 0;
  var childEl = getChildElement(wordDefEl, "def");
  if (entry.AltSpellings == "" || entry.AltSpellings == undefined) {
    getChildElement(childEl, "altSpells").style.display = "none";
  } else {
    shown = true;
    getChildElement(childEl, "altSpells").innerHTML =
      "<b>Alternate Spellings:</b>&nbsp" +
      displayWordList(entry.AltSpellings, searchedTerm, true);
    getChildElement(childEl, "altSpells").style.display = "flex";
  }

  if (entry.Other == "") {
    getChildElement(childEl, "other").style.display = "none";
  } else {
    shown = true;
    onCount++;
    getChildElement(childEl, "other").innerHTML = displayWordList(
      entry.Other,
      searchedTerm,
      true,
    );
    getChildElement(childEl, "other").style.display = "flex";
  }

  if (entry.Notes == "") {
    getChildElement(childEl, "notes").style.display = "none";
  } else {
    shown = true;
    onCount++;
    var notesEl = getChildElement(childEl, "notes");
    notesEl.innerHTML = "*" + processNote(entry.Notes);
    notesEl.style.display = "block";
  }

  if (shown) {
    childEl.style.display = "flex";
    if (currPage == "translator") {
      var spacer = getChildElement(childEl, "defSpacer");
      if (onCount > 1) {
        spacer.style.display = "block";
      } else {
        spacer.style.display = "none";
      }
    }
  } else {
    childEl.style.display = "none";
  }

  if (entry.Nouns == "") {
    getChildElement(wordDefEl, "nounContain").style.display = "none";
  } else {
    childEl = getChildElement(wordDefEl, "noun");
    childEl.innerHTML = "<b>" + entry.Orostara + "a </b>";
    childEl = getChildElement(wordDefEl, "nounFill");
    childEl.innerHTML = displayWordList(entry.Nouns, searchedTerm, true);
    getChildElement(wordDefEl, "nounContain").style.display = "flex";
  }

  if (entry.Verbs == "") {
    getChildElement(wordDefEl, "verbContain").style.display = "none";
  } else {
    childEl = getChildElement(wordDefEl, "verb");
    childEl.innerHTML = "<b>" + entry.Orostara + "o </b>";
    childEl = getChildElement(wordDefEl, "verbFill");
    childEl.innerHTML = displayWordList(entry.Verbs, searchedTerm, true);
    getChildElement(wordDefEl, "verbContain").style.display = "flex";
  }

  if (entry.Adjectives == "") {
    getChildElement(wordDefEl, "adjContain").style.display = "none";
  } else {
    childEl = getChildElement(wordDefEl, "adj");
    childEl.innerHTML = "<b>" + entry.Orostara + "i </b>";
    childEl = getChildElement(wordDefEl, "adjFill");
    childEl.innerHTML = displayWordList(entry.Adjectives, searchedTerm, true);
    getChildElement(wordDefEl, "adjContain").style.display = "flex";
  }

  if (entry.Adverbs == "") {
    getChildElement(wordDefEl, "advContain").style.display = "none";
  } else {
    childEl = getChildElement(wordDefEl, "adv");
    childEl.innerHTML = "<b>" + entry.Orostara + "e </b>";
    childEl = getChildElement(wordDefEl, "advFill");
    childEl.innerHTML = displayWordList(entry.Adverbs, searchedTerm, true);
    getChildElement(wordDefEl, "advContain").style.display = "flex";
  }

  if (currPage == "translator") {
    document.getElementById("wordDefContainer").style.display = "flex";
  } else if (currPage == "rhymes") {
  } else {
    console.log("invalid currPage in displayEntry: " + currPage);
  }
}

function processNote(text) {
  if (text.length == 0) {
    return "";
  }
  var str = text;
  var index = str.indexOf("'");
  if (index != -1) {
    var front = str.substring(0, index);
    var tempBack = str.substring(index + 1);
    var index2 = tempBack.indexOf("'");
    var word = tempBack.substring(0, index2);
    var back = tempBack.substring(index2 + 1);

    var link = returnLink(word);
    if (link == word) {
      // word was not a Orostara word
      var temp = str;
      str = temp.substring(0, index + index2 + 2) + processNote(back);
    } else {
      str = front + link + processNote(back);
    }
  }
  return str;
}

function displayRootWord(word, pronunc, lang) {
  if (Array.isArray(word)) {
    var temp = word[0];
    for (var i = 1; i < word.length; i++) {
      temp += "/" + word[i];
    }
    word = temp;
  }
  if (lang == "Orostara") {
    var word1 = cleanupTextInput(word);
    var arr = word1.split(" ");
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      str += returnLink(arr[i]);
      if (i < arr.length - 1) {
        str += " and ";
      }
    }
    return str;
  } else if (word.match(/[a-z]/i)) {
    //check they're all latin characters
    return "<i>" + word.toLowerCase() + "</i>"; //italicize if yes
  } else {
    return word.toLowerCase() + " (" + pronunc.toLowerCase() + ")";
  }
}

function gotoLinkWord(num) {
  var word = document.getElementById(num).innerHTML;
  gotoWord(word);
}

function gotoWord(word) {
  var entry;
  if (currPage == "translator") {
    clearPage();
    entry = searchOros(word);
    displayEntryArry(entry, "");
  } else if (currPage == "rhymes") {
    rhymeClearPage();
    entry = rhymeOros(word);
    displayRhymeEntryArry(entry, "");
  } else {
    console.log("invalid currPage in gotoWord(" + word + "): " + currPage);
  }
  incMemory("Orostara", word);
}

function returnLink(word) {
  if (currPage == "rhymes") {
    return word;
  }
  if (searchOros(word).length != 0) {
    var str =
      "<u><span class='orosLinkWord' id='" +
      currLinkNum +
      "' onclick='gotoLinkWord(" +
      currLinkNum +
      ")'>" +
      word +
      "</span></u>";
    currLinkNum++;
    return str;
  } else if (word == "" || word == "N,A") {
    return "?";
  } else {
    return word;
  }
}

//given an array and the English searched word if applicable
//commaSeparated is a true false so that this function can recurse
function displayWordList(list1, searched, commaSeparated) {
  var list = list1;
  if (!Array.isArray(list1)) {
    list = [list1];
  }

  var stringList = "";
  for (var i = 0; i < list.length; i++) {
    //element in list matches searched english term
    //don't bother underlining anything if we're just rhyming
    if (
      searched != "findingRhyme" &&
      list[i].toLowerCase() == searched.toLowerCase()
    ) {
      stringList += "<u>" + list[i] + "</u>";
    }
    //element in list has more than one word
    else if (searched != "findingRhyme" && list[i].indexOf(" ") != -1) {
      stringList += displayWordList(list[i].split(" "), searched, false);
    }
    //element doesn't match and is only one word
    else {
      stringList += list[i];
    }

    //spacing for next entry if applicable
    if (i < list.length - 1) {
      if (commaSeparated) {
        stringList += ", ";
      } else {
        stringList += " ";
      }
    }
  }
  return stringList;
}

function getChildElement(el, id) {
  for (var i = 0; i < el.children.length; i++) {
    if (el.children[i].children.length != 0) {
      var found = getChildElement(el.children[i], id);
      if (found != -1) {
        return found;
      }
    }
    if (el.children[i].id == id) {
      return el.children[i];
    }
  }
  return -1;
}
