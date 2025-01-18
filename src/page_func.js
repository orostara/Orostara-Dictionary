//TODO
//add to url for quickpages on quickstart so they go straight there
//display preview of submenus for other tabs on hover
//add report bug button at top?
//persist selection for lessons selected in flashcard game??? and lang?
//flashgame state persist please
//give feedback (checkmark?) indication that cookie deletion completed
//stop content flashing unstyled *crying emoji*
//width property is wigging on the flashcard game when window is small. fix
//add one of those jump back to top of page buttons for full dict and such
//hardcode in the categories table (and full dict?) once it's more complete
//show alternate spellings in rhymezone
//fix the spacing in the rhymezone so it's actually lined up always
//make rhymezone work for multiple syllables (currently only cares about last for some reason)

/* jshint esversion: 8 */

var currPage = "home";
var resourcePage = "translator";
var learningPage = "flashcards";
var quickPage = "partsOfSpeech";
var orosDict = [];
var basicOnly = []; // for the flashcards
var needsDict = [
  "translator",
  "rhymes",
  "categories",
  "fullDict",
  "flashcards",
];

//update if any structural changes are made to the excel file ie adding/moving columns
//check against the dict stored in local storage to make sure having an old version doesn't break the website
var dictVersion = "1.002";

function load() {
  turnPagesOff();
  readCSVFile();
  setupMenuButtons();
  setupDictionarySearch();
}

function setupDictionarySearch() {
  updateForBackButtons();
  setupButtons();
}

function refreshPage() {
  localStorage.clear();
  // window.location.reload();
  newPage(currPage, true);
}

function clearCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  console.log("Current Cookies: " + document.cookie);
}

function load2(page) {
  currPage = page;
  if (needsDict.indexOf(currPage) != -1) {
    if (loadStoredData()) {
      console.log("didn't have to reload!");
      displayPage();
    } else {
      readCSVFile(); //calls displayPage at end of func/processing
    }
  } else {
    console.log("don't need data");
    displayPage();
  }
}

function loadStoredData() {
  //dictionary is out of date and could break the website. reload
  if (localStorage.getItem("dictVersion") != dictVersion) {
    return false;
  }
  var dataPresent = isJsonString(localStorage.getItem("orosDict"));
  if (dataPresent) {
    orosDict = JSON.parse(localStorage.getItem("orosDict"));
    basicOnly = JSON.parse(localStorage.getItem("basicOnly"));
  }
  return dataPresent;
}

function newPage(page, force) {
  if (!force && page == currPage) {
    return;
  }
  switch (currPage) {
    case "lessons":
      setCookie("learning", learningPage);
      break;
    case "flashcards":
      setCookie("learning", learningPage);
      break;
    case "quickstart":
      //save current quickpage
      setCookie("quick", quickPage);
      break;
    case "translator":
      //save current display and search history
      setCookie("transMemory", JSON.stringify(memory));
      setCookie("transMemoryIndex", memoryIndex);
      setCookie("resource", resourcePage);
      break;
    case "rhymes":
      //save current display and search history
      setCookie("rhymeMemory", JSON.stringify(memory));
      setCookie("rhymeMemoryIndex", memoryIndex);
      setCookie("resource", resourcePage);
      break;
    case "categories":
      setCookie("category", currCategory);
      setCookie("resource", resourcePage);
      //save current category
      break;
    case "fullDict":
      //save current display
      setCookie("dict", currDict);
      setCookie("resource", resourcePage);
      break;
  }

  switch (page) {
    case "resources":
      var pg = getCookie("resource");
      if (pg != "") {
        resourcePage = pg;
      } else {
        pg = resourcePage;
      }
      location.href = pg + ".html";
      break;
    case "learning":
      var pg = getCookie("learning");
      if (pg != "") {
        learningPage = pg;
      } else {
        pg = learningPage;
      }
      location.href = pg + ".html";
      break;
    case "community":
      location.href = "social.html";
      break;
    case "home":
      location.href = "index.html";
      break;
    default:
      location.href = page + ".html";
      break;
  }
  currPage = page;
}

function displayPage() {
  if (document.getElementById("loading")) {
    document.getElementById("loading").style.display = "flex";
  }
  switch (currPage) {
    case "lessons":
      learningPage = "lessons";
      break;
    case "flashcards":
      learningPage = "flashcards";
      break;
    case "quickstart":
      var quick = getCookie("quick");
      if (quick != "") {
        setQuickPage(quick);
      }
      setupMenuButtonsNew();
      break;
    case "fullDict":
      var cat = getCookie("dict");
      if (cat != "") {
        currDict = cat;
      }
      resourcePage = "fullDict";
      fillTable();
      break;
    case "categories":
      var cat = getCookie("category");
      if (cat != "") {
        currCategory = cat;
      }
      resourcePage = "categories";
      cfillTable();
      break;
    case "translator":
      var mem = getCookie("transMemory");
      if (mem != "" && mem != "[]") {
        memory = JSON.parse(mem);
        memoryIndex = parseInt(getCookie("transMemoryIndex"));
        reloadMem();
      }
      resourcePage = "translator";
      setupButtons(); //in dictionary_search_func; suets up fore and back buttons
      updateForBackButtons();
      break;
    case "rhymes":
      var mem = getCookie("rhymeMemory");
      if (mem != "" && mem != "[]") {
        memory = JSON.parse(mem);
        memoryIndex = parseInt(getCookie("rhymeMemoryIndex"));
        reloadMem();
      }
      resourcePage = "rhymes";
      setupButtons(); //in dictionary_search_func; suets up fore and back buttons
      updateForBackButtons();
      break;
    case "social":
      break;
    default:
      console.log("currPage value invalid: " + currPage);
      break;
  }
  if (document.getElementById("loading")) {
    document.getElementById("loading").style.display = "none";
  }
}

//exdays is the number of days until the cookie expires
function setCookie(cname, cvalue) {
  var exdays = 10;
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=Strict;";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function turnPagesOff() {
  var pages = ["translator", "flashcards", "category", "fullDict"];

  var index = pages.indexOf(currPage);

  if (index != -1) {
    pages.splice(index, 1);
  }

  for (var i = 0; i < pages.length; i++) {
    document.getElementById(pages[i]).style.display = "none";
  }
}

function setupMenuButtonsNew() {
  //document.getElementById("quickMenu").style.display = "none";
  $(".quickItem").click(function (event) {
    var page;
    var str = cleanupTextInput(this.innerHTML).substring(0, 4).toLowerCase();
    switch (str) {
      case "part":
        page = "partsOfSpeech";
        break;
      case "pref":
        page = "prefixSuffix";
        break;
      case "hono":
        page = "honorifics";
        break;
      case "comm":
        page = "phrases";
        break;
      default:
        console.log("invalid str in setupMenuButtonsNew: " + str);
        page = "";
    }

    setQuickPage(page);
  });
}

function setQuickPage(page) {
  if (quickPage != page) {
    //display correct content
    document.getElementById(quickPage).style.display = "none";
    document.getElementById(page).style.display = "flex";

    //update menu tabs
    var tab = document.getElementById(quickPage + "Pg");
    if (tab.classList.contains("quickItem")) {
      //reset colors
      tab.classList.remove("quickActive");
    } else {
      tab.classList.remove("active");
    }

    tab = document.getElementById(page + "Pg");
    if (tab.classList.contains("quickItem")) {
      //select colors
      tab.classList.add("quickActive");
    } else {
      tab.classList.add("active");
    }
    quickPage = page;
  }
}

function setupMenuButtons() {
  //document.getElementById("quickMenu").style.display = "none";
  $(".menuItem").click(function (event) {
    var page;
    var str = this.innerHTML.substring(0, 4).toLowerCase();
    var quick = false;
    switch (str) {
      case "tran":
        page = "translator";
        break;
      case "quic":
        page = quickPage;
        quick = true;
        break;
      case "part":
        page = "partsOfSpeech";
        quickPage = "partsOfSpeech";
        quick = true;
        break;
      case "pref":
        page = "prefixSuffix";
        quickPage = "prefixSuffix";
        quick = true;
        break;
      case "hono":
        page = "honorifics";
        quickPage = "honorifics";
        quick = true;
        break;
      case "comm":
        page = "phrases";
        quickPage = "phrases";
        quick = true;
        break;
      case "link":
        page = "links";
        break;
      case "full":
        page = "fullDict";
        break;
      case "cate":
        page = "category";
        break;
      case "flas":
        page = "flashcards";
        break;
      default:
        page = "";
    }

    if (!quick) {
      document.getElementById("quickMenu").style.display = "none";
      document.getElementById("quickStartPg").classList.remove("activeSpecial");
    } else {
      document.getElementById("quickStartPg").classList.add("activeSpecial");
      document.getElementById("quickMenu").style.display = "flex";
    }

    if (currPage != page) {
      document.getElementById(currPage).style.display = "none";
      document.getElementById(page).style.display = "flex";

      var tab = document.getElementById(currPage + "Pg");
      if (tab.classList.contains("quickItem")) {
        //reset colors
        tab.classList.remove("quickActive");
      } else {
        tab.classList.remove("active");
      }

      tab = document.getElementById(page + "Pg");
      if (tab.classList.contains("quickItem")) {
        //select colors
        tab.classList.add("quickActive");
      } else {
        tab.classList.add("active");
      }
      currPage = page;
    }
  });
}
