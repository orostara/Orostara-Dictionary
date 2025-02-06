var cprev = "na";
var currCategory = "color";

function cfillTable() {
  document.getElementById("loading").style.display = "flex";
  var containerEl = document.getElementById("categoryDictTable");
  var baseEl = document.getElementById("categoryDataRow");

  var orderedEl = [];
  for (var i = 0; i < orosDict.length; i++) {
    // iterate through entire dictionary
    var rowObj = orosDict[i];

    var wordTypes;
    if (rowObj.Category == "" || rowObj.Category == " ") {
      wordTypes = [];
      continue;
    } else if (Array.isArray(rowObj.Category)) {
      wordTypes = rowObj.Category;
    } else {
      wordTypes = [rowObj.Category];
    }

    var ending;
    if (rowObj.CatRel == "" || rowObj.CatRel == " ") {
      ending = [];
    } else if (Array.isArray(rowObj.CatRel)) {
      ending = rowObj.CatRel;
    } else {
      ending = [rowObj.CatRel];
    }

    for (var j = 0; j < wordTypes.length; j++) {
      var row = baseEl.cloneNode(true);
      row.id = rowObj.Orostara;
      row.classList.add(wordTypes[j]);

      var endType;
      if (j <= ending.length) {
        endType = ending[j];
      } else {
        endType = ending[ending.length - 1];
      }

      if (endType == "verb") {
        row.children[0].innerHTML = rowObj.Orostara + "o";
        row.children[1].innerHTML = simpleListDisplay(rowObj.Verbs);
      } else if (endType == "adj") {
        row.children[0].innerHTML = rowObj.Orostara + "i";
        row.children[1].innerHTML = simpleListDisplay(rowObj.Adjectives);
      } else if (endType == "adv") {
        row.children[0].innerHTML = rowObj.Orostara + "e";
        row.children[1].innerHTML = simpleListDisplay(rowObj.Adverbs);
      } else if (endType == "oth") {
        row.children[0].innerHTML = rowObj.Orostara;
        row.children[1].innerHTML = simpleListDisplay(rowObj.Other);
      } else {
        row.children[0].innerHTML = rowObj.Orostara + "a";
        row.children[1].innerHTML = simpleListDisplay(rowObj.Nouns);
      }

      if (rowObj.CatOrder != "") {
        orderedEl.push({ el: row, order: parseInt(rowObj.CatOrder, 10) });
      } else {
        containerEl.appendChild(row);
      }
    }

    //sort array
    var arr = orderedEl;
    orderedEl = sortArray(arr);

    //insert at top
    for (var j = 0; j < orderedEl.length; j++) {
      containerEl.insertBefore(
        orderedEl[orderedEl.length - 1 - j].el,
        containerEl.childNodes[2],
      );
    }
  }

  cShowOnly(currCategory);
  baseEl.style.display = "none";
}

//array element has 2 properties, el and order
//order is an integer and the only number that matters in this case
//not the prettiest I know but it works
function sortArray(arr) {
  if (arr.length < 2) {
    return arr;
  }
  var lastEl = arr.pop();
  var newArray = sortArray(arr);
  var added = false;
  for (var i = 0; i < newArray.length; i++) {
    if (newArray[i].order > lastEl.order) {
      newArray.splice(i, 0, lastEl);
      added = true;
      break;
    }
  }
  if (!added) {
    newArray.push(lastEl);
  }
  return newArray;
}

function cShowOnly(type) {
  currCategory = type;
  if (type == cprev) {
    showCatContent();
    return;
  }

  var fullTable = document.getElementById("categoryDictTable");

  var counter = 0;
  for (var i = 1; i < fullTable.children.length; i++) {
    var el = fullTable.children[i];
    if (el.classList.contains(type)) {
      el.style.display = "table-row";
      if (counter % 2 == 1) {
        el.style.backgroundColor = "var(--lightlight2)";
      } else {
        el.style.backgroundColor = "white";
      }
      counter++;
    } else {
      el.style.display = "none";
    }
  }

  var string = "";
  switch (type) {
    case "color":
      string += "Colors";
      break;
    case "number":
      string += "Numbers";
      break;
    case "food":
      string += "Food";
      break;
    case "animal":
      string += "Animals";
      break;
    case "plant":
      string += "Plants";
      break;
    case "preposition":
      string += "Prepositions";
      break;
    case "interjection":
      string += "Interjections";
      break;
    case "nature":
      string += "Nature";
      break;
    case "fantasy":
      string += "Fantasy";
      break;
    case "space":
      string += "Outer Space";
      break;
    case "body":
      string += "Anatomy";
      break;
    case "measurement":
      string += "Measurements";
      break;
    case "direction":
      string += "Directions";
      break;
    case "material":
      string += "Materials";
      break;
    case "classification":
      string += "Classifications";
      break;
    case "continent":
      string += "Continents";
      break;
    case "economy":
      string += "Economy";
      break;
    case "week":
      string += "Weekdays";
      break;
    case "month":
      string += "Months";
      break;
    case "value":
      string += "Values";
      break;
    default:
      string += "Help";
      break;
  }

  document.getElementById("cmenu" + type).setAttribute("disabled", "");
  if (cprev != "na") {
    document.getElementById("cmenu" + cprev).removeAttribute("disabled");
    //document.getElementById("cdropdown").style.display = "none";
  }
  cprev = type;
  showCatContent();
  // document.getElementById('numWords').innerHTML = counter;
}

function showCatContent() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("category").style.display = "flex";
}
