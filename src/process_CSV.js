/* jshint esversion: 8 */

//var localFilePath = 'files/Oros_Eng_Dictionary.csv';
var filePath = 'https://raw.githubusercontent.com/brushscape/Orostara-Dictionary/main/files/Oros_Eng_Dictionary.csv';
var langBreakdown = [];
var numWords = 0;
var properNouns = [];

function readCSVFile() {
  $.get(filePath, function(csvdata) {
    var rowData = csvdata.split('\n');
    var colHeaders = rowData[0].split(',');


    for (var row = 1; row < rowData.length; row++) {
      var rowColData = rowData[row].split(',');
      var rowObj = {};
      for (var col = 0; col < rowColData.length - 1; col++) {
        if (rowColData[col].search('/') != -1) {
          rowObj[colHeaders[col].replace(/\s/g, "")] = rowColData[col].split('/');
        } else {
          rowObj[colHeaders[col].replace(/\s/g, "")] = rowColData[col];
        }
      }
      orosDict.push(rowObj);

      if (rowObj.Type == 'proper') {
        properNouns.push(rowObj.Orostara);
      }

      //just to show the language breakdown in the console
      if (rowObj.RootLanguage != 'Orostara' && rowObj.Type != 'proper') {
        numWords++;
        var el = getCorrectLang(rowObj.RootLanguage);
        if (el != -1) {
          var count = langBreakdown[el].Count;
          count++;
          langBreakdown[el].Count = count;
          langBreakdown[el].Percent = (count / numWords) * 100;
        } else {
          var newEl = { Lang: rowObj.RootLanguage, Count: 1, Percent: (1 / numWords) * 100 };
          langBreakdown.push(newEl);
        }
      }


    }
    fillTable();
    //console.log(langBreakdown);
  });
}

function getCorrectLang(lang) {
  for (var i = 0; i < langBreakdown.length; i++) {
    if (langBreakdown[i].Lang == lang) {
      return i;
    }
  }
  return -1;
}
